import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

function FormControls({ formControls = [], formData, setFormData }) {
  const [errors, setErrors] = useState({});
  const [isTouched, setIsTouched] = useState(false);

  const handleBlur = () => {
    setIsTouched(true);
  };

  console.log("is moved", isTouched);

  // validation rules :
  let validationRules = {
    userName: {
      required: true,

      validate: (value) => ({
        isValid: /^[a-zA-Z0-9][a-zA-Z0-9_]{2,14}$/.test(value),
        error: "Invalid username",
      }),
    },

    userEmail: {
      required: true,

      validate: (value) => ({
        isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        error: "Invalid email format",
      }),
    },

    password: {
      required: true,

      validate: (value) => ({
        isValid:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          ),
        error:
          "Password must be 8+ characters with uppercase, lowercase, number, and special character",
      }),
    },
  };

  let validateField = (name, value) => {
    const rule = validationRules[name];

    console.log("consoled", name);
    console.log("check rule", rule);

    if (!value && rule.required) {
      console.log("consoled");
      return {
        isValid: false,
        error: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
      };
    }

    return rule.validate(value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    const { isValid, error } = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: isValid ? "" : error,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    const { isValid, error } = validateField(name, value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: isValid ? "" : error,
    }));
  };

  function renderComponentByType(controlItem) {
    let element = null;
    const currentControlItemValue = formData[controlItem.name] || "";
    const errorMessage = errors[controlItem.name];

    switch (controlItem.componentType) {
      case "input":
        element = (
          <>
            <Input
              id={controlItem.name}
              name={controlItem.name}
              placeholder={controlItem.placeholder}
              type={controlItem.type}
              value={currentControlItemValue}
              className={`border ${
                errorMessage
                  ? "border-red-500"
                  : `${
                      isTouched && currentControlItemValue
                        ? "border-green-500"
                        : "border-gray-400"
                    }`
              } p-2 `}
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
              aria-invalid={!!errorMessage}
            />
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          </>
        );
        break;
      case "select":
        element = (
          <>
            <Select
              onValueChange={(value) =>
                handleSelectChange(controlItem.name, value)
              }
              value={currentControlItemValue}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={controlItem.label} />
              </SelectTrigger>
              <SelectContent>
                {controlItem.options && controlItem.options.length > 0
                  ? controlItem.options.map((optionItem) => (
                      <SelectItem key={optionItem.id} value={optionItem.id}>
                        {optionItem.label}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>

            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          </>
        );
        break;
      case "textarea":
        element = (
          <>
            <Textarea
              id={controlItem.name}
              name={controlItem.name}
              placeholder={controlItem.placeholder}
              value={currentControlItemValue}
              onChange={(e) => handleChange(e)}
              className={`border ${
                errorMessage ? "border-red-500" : "border-gray-300"
              } p-2`}
              aria-invalid={!!errorMessage}
            />
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          </>
        );
        break;

      default:
        element = (
          <>
            {" "}
            <Input
              id={controlItem.name}
              name={controlItem.name}
              placeholder={controlItem.placeholder}
              type={controlItem.type}
              value={currentControlItemValue}
              onChange={(e) => handleChange(e)}
              className={`border ${
                errorMessage ? "border-red-500" : "border-gray-300"
              } p-2`}
              aria-invalid={!!errorMessage}
            />
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          </>
        );
        break;
    }

    return element;
  }

  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controlItem) => {
        console.log("logged", controlItem);

        return (
          <div key={controlItem.name}>
            <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
            {renderComponentByType(controlItem)}
          </div>
        );
      })}
    </div>
  );
}

export default FormControls;
