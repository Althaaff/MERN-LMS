import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Delete, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InstructorCourses = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>

        <Button
          onClick={() => navigate("/instructor/create-new-course")}
          className="p-6 cursor-pointer"
        >
          Create New Courses
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Courses</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  React JS full course 2025
                </TableCell>
                <TableCell>100</TableCell>
                <TableCell>$5000</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-6 h-6" />
                  </Button>

                  <Button variant="ghost" size="sm">
                    <Delete className="w-6 h-6" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorCourses;
