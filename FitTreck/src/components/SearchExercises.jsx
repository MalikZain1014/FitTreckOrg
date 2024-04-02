import { useEffect, useState } from "react";
import axios from "axios"; // Import axios

import HorizontalScrollBar from "../components/HorizontalScrollBar";
import { AnimationOnScroll } from "react-animation-on-scroll";

const SearchExercises = () => {
  const [search, setSearch] = useState("");
  const [bodyParts, setBodyParts] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        const response = await axios.get("http://localhost:5500/exercises");
        setBodyParts(
          Array.from(
            new Set(response.data.data.map((exercise) => exercise.bodyPart))
          )
        );
        setFilteredExercises(response.data.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercisesData();
  }, []);

  const searchHandler = async () => {
    if (search) {
      try {
        const exerciseData = await axios.get("http://localhost:5500/exercises");

        const searchExercises = exerciseData.data.filter(
          (exercise) =>
            exercise.name.toLowerCase().includes(search) ||
            exercise.target.toLowerCase().includes(search) ||
            exercise.bodyPart.toLowerCase().includes(search) ||
            exercise.equipment.toLowerCase().includes(search)
        );
        setSearch("");
        setFilteredExercises(searchExercises);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleBodyPartClick = (selectedBodyPart) => {
    const exercisesByBodyPart = filteredExercises.filter(
      (exercise) => exercise.bodyPart === selectedBodyPart
    );
    setFilteredExercises(exercisesByBodyPart);
  };

  return (
    <>
      <section className="flex flex-col items-center gap-y-12 p-5 w-full">
        <AnimationOnScroll animateIn="animate__rubberBand">
          <h1 className="font-black text-2xl sm:text-3xl text-center text-slate-800 dark:text-slate-300">
            Awesome Exercises You
            <br /> Should Know
          </h1>
        </AnimationOnScroll>
        <div className="flex items-center sm:items-start w-full sm:w-[80%] sm:flex-row gap-y-2 sm:gap-y-0">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            type="text"
            placeholder="Search Exercises"
          />
          <button
            onClick={searchHandler}
            className="text-sm sm:text-base duration-500 ring-offset-[#fdf4ff] dark:ring-offset-slate-800 bg-primary ml-3 hover:ring hover:ring-offset-2 hover:ring-primary text-white top-12 py-3 sm:py-2 px-3 sm:px-5 rounded-md"
          >
            Search
          </button>
        </div>
      </section>
      <div className="flex justify-center gap-4">
        {bodyParts.map((part, index) => (
          <button
            key={index}
            onClick={() => handleBodyPartClick(part)}
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300"
          >
            {part}
          </button>
        ))}
      </div>
      <HorizontalScrollBar
        data={filteredExercises.map((exercise) => exercise.bodyPart)}
        isBodyParts
        bodyPart={filteredExercises.map((exercise) => exercise.bodyPart)}
      />
    </>
  );
};

export default SearchExercises;
