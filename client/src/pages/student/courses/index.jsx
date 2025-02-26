import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { filterOptions, sortOptions } from "@/config";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { Label } from "@radix-ui/react-dropdown-menu";

import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const StudentViewCoursesPage = () => {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  // console.log("search params: ", searchParams.has("category"));

  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);

  const createSearchParamsHelper = (filterParams) => {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");

        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }

    return queryParams.join("&");
  };

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    console.log("Updated filters:", filters);
  }, [filters]); // Runs every time `filters` updates

  // const handleFilterOnChange = (getSectionId, getCurrentOption) => {
  //   console.log("console1", getSectionId, "console2", getCurrentOption);

  //   let copyFilters = { ...filters };

  //   const indexOfCurrentSection =
  //     Object.keys(copyFilters).indexOf(getSectionId);

  //   console.log(
  //     "index :",
  //     indexOfCurrentSection,
  //     "getSectionId:",
  //     getSectionId
  //   );

  //   // logic: if copy filter array empty --> [getSectionId]  dynamically sets the key in the object.  [getCurrentOption.id] --> creates an array with a single value.
  //   if (indexOfCurrentSection === -1) {
  //     copyFilters = {
  //       ...copyFilters,
  //       [getSectionId]: [getCurrentOption.id],
  //     };

  //     // console.log("filter :", copyFilters);
  //   } else {
  //     const indexOfCurrentOption = copyFilters[getSectionId].indexOf(
  //       getCurrentOption.id
  //     );

  //     if (indexOfCurrentOption === -1) {
  //       copyFilters[getSectionId].push(getCurrentOption.id); // adds
  //     } else {
  //       copyFilters[getSectionId].splice(indexOfCurrentOption, 1); // removes
  //     }

  //     setFilters(copyFilters);
  //     sessionStorage.setItem("filters", JSON.stringify(copyFilters));
  //   }
  // };

  const handleFilterOnChange = (getSectionId, getCurrentOption) => {
    console.log("console1", getSectionId, "console2", getCurrentOption);

    // Always create a new copy of filters to avoid mutating state directly
    let copyFilters = { ...filters };

    // Check if the section exists in filters
    if (!copyFilters[getSectionId]) {
      copyFilters[getSectionId] = [getCurrentOption.id];
    } else {
      const indexOfCurrentOption = copyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1) {
        copyFilters[getSectionId] = [
          ...copyFilters[getSectionId],
          getCurrentOption.id,
        ]; // Create a new array to trigger state updates
      } else {
        copyFilters[getSectionId] = copyFilters[getSectionId].filter(
          (id) => id !== getCurrentOption.id
        ); // Remove the item without mutating the original array

        // console.log("[] :", copyFilters[getSectionId]);
      }
    }

    setFilters({ ...copyFilters }); // Set new state with a new reference

    // console.log("key item is :", Object.keys(filters));
    sessionStorage.setItem("filters", JSON.stringify(copyFilters));
  };

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();

    // console.log("respons: ", response);

    if (response?.success) {
      setStudentViewCoursesList(response?.data);
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="container p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
          <div className="space-y-4">
            {/* filters */}

            {Object.keys(filterOptions).map((keyItem) => {
              // console.log(keyItem);

              return (
                <div className="p-4 space-y-4" key={keyItem.id}>
                  <h3 className="font-bold mb-3 ">{keyItem.toUpperCase()}</h3>

                  <div className="grid gap-2 mt-2">
                    {filterOptions[keyItem].map((option) => {
                      // console.log("keyItem :", keyItem);
                      return (
                        <Label
                          key={option.id}
                          className="flex font-medium items-center gap-3"
                        >
                          <Checkbox
                            checked={
                              filters &&
                              Object.keys(filters).length > 0 &&
                              filters[keyItem] &&
                              filters[keyItem].indexOf(option.id) > -1
                            }
                            onCheckedChange={() =>
                              handleFilterOnChange(keyItem, option)
                            }
                          />

                          {option.label}
                        </Label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex justify-end items-center gap-2 mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-[16px] font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-black font-bold">10 Results</span>{" "}
          </div>

          <div className="space-y-4">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card key={courseItem?._id} className="cursor-pointer">
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={courseItem?.image}
                        alt="course image"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {courseItem?.title}
                      </CardTitle>

                      <p className="text-sm text-gray-500 font-bold mb-1">
                        Created By {courseItem.instructorName}
                      </p>

                      <div className="flex items-center">
                        <p className="text-[16px] text-gray-600 mb-2">{`${
                          courseItem.curriculam.length
                        } ${
                          courseItem.curriculam.length <= 1
                            ? "Lecture"
                            : "Lectures"
                        } - ${courseItem?.level.toUpperCase()} Lectures `}</p>

                        <span className="text-[12px] text-gray-600 ml-2 mb-2 p-[3px] bg-white-300 border rounded-md font-extrabold hover:bg-white">
                          {courseItem?.level}
                        </span>
                      </div>
                      <p className="font-bold text-lg">
                        ${courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <h1>No Counses found!</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewCoursesPage;
