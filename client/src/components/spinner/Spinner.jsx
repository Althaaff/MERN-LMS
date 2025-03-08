import { lineSpinner } from "ldrs";

lineSpinner.register();
const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <l-line-spinner
        size="40"
        stroke="3"
        speed="1"
        color="black"
      ></l-line-spinner>
    </div>
  );
};

export default Spinner;
