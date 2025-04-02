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

import { deleteCommentService, getAllCommentsService } from "@/services";
import { Delete } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const GetAllComments = () => {
  const [allComments, setAllComments] = useState([]);
  console.log("all comments", allComments);

  const fetchAllComments = async () => {
    const response = await getAllCommentsService();

    if (response?.success) {
      setAllComments(response.comments);
    }
  };

  useEffect(() => {
    fetchAllComments();
  }, []);

  const handleCommentDelete = async (commentId) => {
    console.log(commentId);
    try {
      const response = await deleteCommentService(commentId);

      if (response?.success) {
        toast.success("User Review deleted..");

        setAllComments((prevComments) =>
          prevComments.filter((prevComments) => prevComments?._id !== commentId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle className="text-3xl font-extrabold">All Comments</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DATE UPDATED</TableHead>
                <TableHead>COMMENT CONTENT</TableHead>
                <TableHead>COURSE ID </TableHead>
                <TableHead>USER ID </TableHead>
                <TableHead className="text-right">DELETE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allComments?.length > 0
                ? allComments?.map((comment) => {
                    return (
                      <>
                        <TableRow>
                          <TableCell className="font-medium">
                            {`${new Date(comment.updatedAt).getDate()}/${
                              new Date(comment.updatedAt).getMonth() + 1
                            }/${new Date(
                              comment.updatedAt
                            ).getFullYear()}`}{" "}
                          </TableCell>
                          <TableCell>{comment?.content}</TableCell>
                          <TableCell>{comment?.courseId}</TableCell>
                          <TableCell>${comment?.userId}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => handleCommentDelete(comment?._id)}
                              variant="ghost"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Delete className="w-6 h-6" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export { GetAllComments };
