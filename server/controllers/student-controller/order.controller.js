import { paypal } from "../../helpers/paypal.js";
import { Order } from "../../models/order.model.js";
import { Course } from "../../models/course.model.js";
import { StudentCourses } from "../../models/student.course.model.js";

const { CLIENT_URL } = process.env;

console.log("client url :", CLIENT_URL);

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;

    console.log("title :", courseTitle);

    // create payment json :
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },

      redirect_urls: {
        return_url: `${CLIENT_URL}/payment-return`,
        cancel_url: `${CLIENT_URL}/payment-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: courseTitle,
                sku: courseId,
                price: coursePricing,
                currency: "USD",
                quantity: 1,
              },
            ],
          },

          amount: {
            currency: "USD",
            total: coursePricing.toFixed(2),
          },
          description: courseTitle,
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment!",
        });
      } else {
        const newlyCreatedCourseOrder = new Order({
          userId,
          userName,
          userEmail,
          orderStatus,
          paymentMethod,
          paymentStatus,
          orderDate,
          paymentId,
          payerId,
          instructorId,
          instructorName,
          courseImage,
          courseTitle,
          courseId,
          coursePricing,
        });

        await newlyCreatedCourseOrder.save();

        const approveUrl = paymentInfo.links.find(
          (link) => link.rel == "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          data: {
            approveUrl,
            orderId: newlyCreatedCourseOrder._id,
          },
        });
      }
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({
        message: "Order not found!",
        success: false,
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    await order.save();

    // update out student course model :
    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    console.log("student courses :", StudentCourses);

    if (studentCourses) {
      studentCourses.courses.push({
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      });

      await studentCourses.save();
    } else {
      const newStudentCourses = await StudentCourses({
        userId: order.userId,
        courses: [
          {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          },
        ],
      });

      await newStudentCourses.save();
    }
    const courseBeforeUpdate = await Course.findById(order.courseId);
    console.log("Before Update:", courseBeforeUpdate);

    const updatedCourse = await Course.findByIdAndUpdate(
      order.courseId,
      {
        $push: {
          students: {
            studentId: order.userId,
            studentName: order.userName,
            studentEmail: order.userEmail,
            paidAmount: order.coursePricing,
          },
        },
      },
      { new: true } // This ensures the updated document is returned
    );
    await updatedCourse.save();

    console.log("After Update:", updatedCourse.students.length);
    return res.status(201).json({
      success: true,
      message: "Order confirmed!",
      data: updatedCourse,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export { createOrder, capturePaymentAndFinalizeOrder };
