"use client";

import React from "react";
import { motion } from "framer-motion";
import Field from "./Field";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import { CompanyData } from "../page";

type Fields = {
  company_name: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  address: string;
  description: string;
  industry: string;
  company_size: string;
  tax_id: string;
  status: string;
};

type Props = {
  title: string;
  fields: Fields;
  form: CompanyData | null;
  statusText: string;
  isEditing: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
};

export default function CompanyFormCard({
  title,
  fields,
  form,
  statusText,
  isEditing,
  onChange,
}: Props) {
  const normalizeValue = (value?: string | null) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (
        trimmed === "" ||
        trimmed.toLowerCase() === "null" ||
        trimmed.toLowerCase() === "undefined"
      ) {
        return "";
      }
      return value;
    }
    return "";
  };

  const getPlaceholder = (value?: string | null) => {
    if (isEditing) return "";
    return normalizeValue(value) === "" ? "" : "";
  };

  return (
    <motion.div
      className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -2 }}
    >
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Field
            label={fields.company_name}
            name="company_name"
            value={normalizeValue(form?.company_name)}
            placeholder={getPlaceholder(form?.company_name)}
            onChange={onChange}
            disabled={!isEditing}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Field
            label={fields.email}
            name="email"
            value={normalizeValue(form?.email)}
            placeholder={getPlaceholder(form?.email)}
            disabled
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Field
            label={fields.phone}
            name="phone"
            value={normalizeValue(form?.phone)}
            placeholder={getPlaceholder(form?.phone)}
            onChange={onChange}
            disabled={!isEditing}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Field
            label={fields.industry}
            name="industry"
            value={normalizeValue(form?.industry)}
            placeholder={getPlaceholder(form?.industry)}
            onChange={onChange}
            disabled={!isEditing}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <SelectField
            label={fields.company_size}
            name="company_size"
            value={
              isEditing
                ? normalizeValue(form?.company_size)
                : normalizeValue(form?.company_size)
            }
            onChange={onChange}
            disabled={!isEditing}
            options={["1-10", "11-50", "51-200", "201-500", "500+"]}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Field
            label={fields.website}
            name="website"
            value={normalizeValue(form?.website)}
            placeholder={getPlaceholder(form?.website)}
            onChange={onChange}
            disabled={!isEditing}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Field
            label={fields.city}
            name="city"
            value={normalizeValue(form?.city)}
            placeholder={getPlaceholder(form?.city)}
            onChange={onChange}
            disabled={!isEditing}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Field
            label={fields.address}
            name="address"
            value={normalizeValue(form?.address)}
            placeholder={getPlaceholder(form?.address)}
            onChange={onChange}
            disabled={!isEditing}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Field
            label={fields.tax_id}
            name="tax_id"
            value={normalizeValue(form?.tax_id)}
            placeholder={getPlaceholder(form?.tax_id)}
            disabled
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <Field
            label={fields.status}
            name="status"
            value={normalizeValue(statusText)}
            disabled
          />
        </motion.div>

        <motion.div
          className="md:col-span-2"
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <TextAreaField
            label={fields.description}
            name="description"
            value={normalizeValue(form?.description)}
            onChange={onChange}
            disabled={!isEditing}
            className="md:col-span-2"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}