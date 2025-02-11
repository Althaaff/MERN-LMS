import FormControls from "@/components/common-form/Form-controls";
import { Button } from "@/components/ui/button";

const CommonForm = ({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* render form controls here  */}
        <FormControls
          formControls={formControls}
          formData={formData}
          setFormData={setFormData}
        />
        <Button type="submit" className="w-full mt-5">
          {buttonText || "Submit"}
        </Button>
      </form>
    </>
  );
};

export default CommonForm;
