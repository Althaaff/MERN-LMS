import Spinner from "@/components/spinner/Spinner";
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
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  fetchStudentViewCourseListService,
  checkCoursePurchaseService,
  getAllCourseProgressPercentage,
} from "@/services";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const StudentViewCoursesPage = () => {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [progressPercentage, setProgressPercentage] = useState([]);
  const navigate = useNavigate();
  const [purchased, setPurchased] = useState(false);

  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

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
    const fetchCourses = async () => {
      try {
        const response = await getAllCourseProgressPercentage();
        if (response?.success) {
          setPurchased(response?.purchased); // Set purchased state
          setProgressPercentage(response?.purchased ? response?.data : []); // Only store progress if purchased
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  // remove the persisted filters from session storage when page loads :
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  // testing :
  useEffect(() => {
    console.log("Updated filters:", filters);
  }, [filters]); // Runs every time `filters` updates

  const handleFilterOnChange = (getSectionId, getCurrentOption) => {
    // Always create a new copy of filters to avoid mutating state directly
    let copyFilters = { ...filters };

    if (!copyFilters[getSectionId]) {
      copyFilters[getSectionId] = [getCurrentOption.id];
      console.log("Added first filter option! ");
    } else {
      const indexOfCurrentOption = copyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1) {
        // console.log("Added another filter option!");
        copyFilters[getSectionId] = [
          ...copyFilters[getSectionId],
          getCurrentOption.id,
        ];
      } else {
        console.log("Removed filter option!");
        copyFilters[getSectionId] = copyFilters[getSectionId].filter(
          (id) => id !== getCurrentOption.id
        ); // Remove the item without mutating the original array
      }
    }

    setFilters({ ...copyFilters }); // Set new state with a new reference

    // console.log("key item is :", Object.keys(filters));
    sessionStorage.setItem("filters", JSON.stringify(copyFilters));
  };

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });

    setLoadingState(true);
    try {
      const response = await fetchStudentViewCourseListService(query);
      // console.log("respons: ", response);
      if (response?.success) {
        setStudentViewCoursesList(response?.data);
        setLoadingState(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  }

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  //  handle navigate
  async function handleNavigate(getCurrentCourseId) {
    let targetRoute = `/course-progress/${getCurrentCourseId}`;

    try {
      checkCoursePurchaseService(getCurrentCourseId, auth?.user?._id)
        .then((response) => {
          console.log("purchase response :", response);

          if (!response?.success || !response?.data) {
            // If not purchased navigate to the course details page :
            navigate(`/course/details/${getCurrentCourseId}`, {
              replace: true,
            });
          } else {
            navigate(targetRoute);
          }
        })
        .catch((error) => {
          console.error("Error fetching purchase info:", error);
        });
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  }

  // handle Clear filters :
  const handleClearFilters = () => {
    setFilters({});
    setSearchParams(new URLSearchParams());
    sessionStorage.removeItem("filters");

    setSort("price-lowtohigh");

    // console.log("filters cleared!");
  };

  useEffect(() => {
    const filtersFromState = location.state?.filters;
    const filtersFromStorage =
      JSON.parse(sessionStorage.getItem("filters")) || {};

    setFilters(filtersFromState || filtersFromStorage);
    setSort("price-lowtohigh");
  }, [location.state]);

  // Remove the persisted filters from session storage when page unmounts :
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
          <div>
            {/* filters */}
            {Object.keys(filterOptions).map((keyItem) => {
              // console.log(keyItem);

              return (
                <div className="p-4 " key={keyItem.id}>
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

        <div className="flex-1 w-full">
          <div className="flex justify-end items-center gap-2 mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleClearFilters}
                className="p-2 bg-blue-400 border-none rounded-md text-white cursor-pointer"
              >
                Clear Filters
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 p-5 cursor-pointer"
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
            </div>
            <span className="text-sm text-black font-bold">
              {studentViewCoursesList.length} Results
            </span>{" "}
          </div>

          <div className="space-y-4">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => {
                return (
                  <>
                    <Card
                      key={courseItem?._id}
                      className="cursor-pointer w-full"
                      onClick={() => handleNavigate(courseItem?._id)}
                    >
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
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-lg">
                              ${courseItem?.pricing}
                            </p>
                            {purchased &&
                              (() => {
                                const currentProgress =
                                  progressPercentage?.find(
                                    (progress) =>
                                      progress.courseId === courseItem._id
                                  );

                                if (!currentProgress) return null; // If no progress found, don't render anything

                                const percentage =
                                  currentProgress.progressPercentage ?? 0;

                                return (
                                  <>
                                    <div className="relative w-[20%] h-[8px] bg-gray-200 rounded-md overflow-hidden gap-2">
                                      <div
                                        className={
                                          percentage === 100
                                            ? "bg-green-600"
                                            : percentage <= 10
                                            ? "bg-red-600"
                                            : "bg-blue-400"
                                        }
                                        style={{
                                          width: `${percentage}%`,
                                          height: "100%",
                                          transition: "width 1s ease-in-out",
                                        }}
                                      ></div>
                                    </div>

                                    <p className="font-normal text-sm">
                                      {percentage}
                                      <span className="text-blue-700">%</span>
                                    </p>
                                  </>
                                );
                              })()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                );
              })
            ) : loadingState ? (
              <Spinner />
            ) : (
              <h1 className="font-extrabold flex items-center justify-center text-2xl mr-2">
                No Courses found!
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewCoursesPage;
