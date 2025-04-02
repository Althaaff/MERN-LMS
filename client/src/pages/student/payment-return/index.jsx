import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PayPalPaymentReturnPage = () => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      async function capturePayment() {
        const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

        console.log("order Id :", orderId);

        const response = await captureAndFinalizePaymentService(
          paymentId,
          payerId,
          orderId
        );

        if (response?.success) {
          sessionStorage.removeItem("currentOrderId");
          console.log("response: ", response);

          // if response is success then navigate to the -->/student-courses
          window.location.href = "/student-courses";
        }
      }

      capturePayment();
    }
  }, [paymentId, payerId]);

  console.log("params: ", params);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Processing... Please wait</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default PayPalPaymentReturnPage;
