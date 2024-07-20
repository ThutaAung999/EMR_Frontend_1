import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { MultiSelect, Textarea } from "@mantine/core";
import { IEmrDTO } from "../model/emr.model";

interface FormFieldsProps {
  control: Control<IEmrDTO>;
  errors: FieldErrors<IEmrDTO>;
  diseaseOptions: { value: string; label: string }[];
  medicineOptions: { value: string; label: string }[];
  patientOptions: { value: string; label: string }[];
}

const FormFields: React.FC<FormFieldsProps> = ({
  control,
  errors,
  diseaseOptions,
  medicineOptions,
  patientOptions,
}) => {
  return (
    <>
      <Controller
        name="diseases"
        control={control}
        render={({ field }) => (
          <MultiSelect
            data={diseaseOptions}
            label="Diseases"
            placeholder="Select diseases"
            value={field.value}
            onChange={(values) => field.onChange(values)}
            error={errors.diseases && "Please select at least one disease"}
          />
        )}
      />
      <Controller
        name="medicines"
        control={control}
        render={({ field }) => (
          <MultiSelect
            data={medicineOptions}
            label="Medicine"
            placeholder="Select medicine"
            value={field.value}
            onChange={(values) => field.onChange(values)}
            error={errors.medicines && "Please select at least one medicine"}
          />
        )}
      />
      <Controller
        name="patients"
        control={control}
        render={({ field }) => (
          <MultiSelect
            data={patientOptions}
            label="Patient"
            placeholder="Select patients"
            value={field.value}
            onChange={(values) => field.onChange(values)}
            error={errors.patients && "Please select at least one patient"}
          />
        )}
      />
      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Note :"
            autosize
            minRows={2}
            maxRows={4}
            placeholder="Enter your notes"
            {...field}
            error={errors.notes?.message}
          />
        )}
      />
    </>
  );
};

export default FormFields;
