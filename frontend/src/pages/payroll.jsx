import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";

import {
  useGetMyPayslipsQuery,
  useGetAllPayrollsQuery,
  useMarkAsPaidMutation,
  useGetAllStaffQuery,
  useGeneratePayrollMutation,
} from "../features/payroll/payrollApiSlice.js";

const Payroll = () => {
  const user = useSelector(selectCurrentUser);
  const isAdmin = user?.role === "admin";

  // ================= STAFF PAYROLL =================

  const staffQuery = useGetMyPayslipsQuery(undefined, {
    skip: isAdmin,
  });

  // ================= ADMIN PAYROLL =================

  const adminQuery = useGetAllPayrollsQuery(undefined, {
    skip: !isAdmin,
  });

  // ================= STAFF LIST =================

  const { data: staffData, isLoading: staffLoading } =
    useGetAllStaffQuery(undefined, {
      skip: !isAdmin,
    });

  // ================= MUTATIONS =================

  const [markAsPaid] = useMarkAsPaidMutation();
  const [generatePayroll, { isLoading: generating }] =
    useGeneratePayrollMutation();

  // ================= FORM STATE =================

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    month: "September",
    year: new Date().getFullYear(),
    baseSalary: "",

    medical: 0,
    conveyance: 0,
    allowanceOther: 0,

    tax: 0,
    unpaidLeaves: 0,
    deductionOther: 0,
  });

  // ================= SELECT QUERY =================

  const activeQuery = isAdmin ? adminQuery : staffQuery;
  const { data, isLoading, isError, error } = activeQuery;

  // ================= FORM INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= GENERATE PAYROLL =================

  const handleGeneratePayroll = async (e) => {
    e.preventDefault();

    if (!formData.employeeId) {
      alert("Please select an employee");
      return;
    }

    if (!formData.baseSalary) {
      alert("Please enter base salary");
      return;
    }

    try {
      await generatePayroll({
        employeeId: formData.employeeId,
        month: formData.month,
        year: Number(formData.year),
        baseSalary: Number(formData.baseSalary),

        allowances: {
          medical: Number(formData.medical),
          conveyance: Number(formData.conveyance),
          other: Number(formData.allowanceOther),
        },

        deductions: {
          tax: Number(formData.tax),
          unpaidLeaves: Number(formData.unpaidLeaves),
          other: Number(formData.deductionOther),
        },
      }).unwrap();

      alert("Payroll generated successfully!");

      // Reset form
      setFormData({
        employeeId: "",
        month: "September",
        year: new Date().getFullYear(),
        baseSalary: "",
        medical: 0,
        conveyance: 0,
        allowanceOther: 0,
        tax: 0,
        unpaidLeaves: 0,
        deductionOther: 0,
      });

      setShowForm(false);
    } catch (err) {
      console.error("Generate Payroll Error:", err);

      alert(
        err?.data?.message || "Failed to generate payroll"
      );
    }
  };

  // ================= LOADING =================

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading Payroll Data...
      </div>
    );
  }

  // ================= ERROR =================

  if (isError) {
    return (
      <div className="p-6 text-red-500 border border-red-200 rounded-md bg-red-50 m-6">
        <p className="font-semibold">Error fetching payroll records.</p>
        <p className="text-sm">
          {error?.data?.message || "Unauthorized access or server issue."}
        </p>
      </div>
    );
  }

  // Safe Data Extraction
  const records = (isAdmin ? data?.payrolls : data?.payslips) || [];
  const staff = staffData?.staff || [];

  return (
    <section className="p-6 max-w-7xl mx-auto">

      {/* ================= HEADER ================= */}

      <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isAdmin ? "All Staff Payrolls" : "My Payslips"}
        </h1>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? "Close Form" : "+ Generate Payroll"}
          </button>
        )}
      </header>

      {/* ================= GENERATE PAYROLL FORM ================= */}

      {isAdmin && showForm && (
        <form
          onSubmit={handleGeneratePayroll}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8"
        >
          <h2 className="text-xl font-semibold mb-5 text-gray-800">
            Generate Monthly Payroll
          </h2>

          {/* Employee Selection */}
          <div className="mb-4">
            <label htmlFor="employeeId" className="block text-sm font-medium mb-1 text-gray-700">
              Select Employee
            </label>

            <select
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">
                {staffLoading ? "Loading staff..." : "Select Staff"}
              </option>

              {staff.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} - {employee.position || "Employee"}
                </option>
              ))}
            </select>
          </div>

          {/* Month + Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium mb-1 text-gray-700">
                Month
              </label>

              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {[
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1 text-gray-700">
                Year
              </label>

              <input
                id="year"
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Base Salary */}
          <div className="mb-6">
            <label htmlFor="baseSalary" className="block text-sm font-medium mb-1 text-gray-700">
              Base Salary
            </label>

            <input
              id="baseSalary"
              type="number"
              name="baseSalary"
              value={formData.baseSalary}
              onChange={handleChange}
              placeholder="Enter base salary"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Allowances */}
          <fieldset className="mb-6">
            <legend className="font-semibold text-lg mb-3 text-gray-800">
              Allowances
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                name="medical"
                value={formData.medical}
                onChange={handleChange}
                placeholder="Medical"
                className="border border-gray-300 rounded-md px-3 py-2"
              />

              <input
                type="number"
                name="conveyance"
                value={formData.conveyance}
                onChange={handleChange}
                placeholder="Conveyance"
                className="border border-gray-300 rounded-md px-3 py-2"
              />

              <input
                type="number"
                name="allowanceOther"
                value={formData.allowanceOther}
                onChange={handleChange}
                placeholder="Other Allowance"
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </fieldset>

          {/* Deductions */}
          <fieldset className="mb-6">
            <legend className="font-semibold text-lg mb-3 text-gray-800">
              Deductions
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                placeholder="Tax"
                className="border border-gray-300 rounded-md px-3 py-2"
              />

              <input
                type="number"
                name="unpaidLeaves"
                value={formData.unpaidLeaves}
                onChange={handleChange}
                placeholder="Unpaid Leaves"
                className="border border-gray-300 rounded-md px-3 py-2"
              />

              <input
                type="number"
                name="deductionOther"
                value={formData.deductionOther}
                onChange={handleChange}
                placeholder="Other Deduction"
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </fieldset>

          {/* Submit */}
          <button
            type="submit"
            disabled={generating}
            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {generating ? "Generating..." : "Generate Payroll"}
          </button>
        </form>
      )}

      {/* ================= PAYROLL RECORDS ================= */}

      {records.length === 0 ? (
        <div className="text-gray-500 text-center py-10 bg-white rounded-lg border border-gray-100">
          No payroll records found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {records.map((item) => (
            <article
              key={item._id}
              className="p-4 bg-white rounded shadow-sm border border-gray-200 flex flex-col justify-between"
            >
              <div>
                {isAdmin && (
                  <h3 className="font-semibold text-lg text-gray-800">
                    {item.employee?.name || "Unknown Staff"}
                  </h3>
                )}

                <p className="text-sm text-gray-600">
                  Period: {item.month} {item.year}
                </p>

                <div className="my-2 border-t border-gray-100 pt-2 space-y-1">
                  <p className="text-sm text-gray-700">
                    Base Salary: PKR {item.baseSalary ?? 0}
                  </p>

                  <p className="font-bold text-blue-600">
                    Net Salary: PKR {item.netSalary ?? 0}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-50">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    item.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {(item.status || "pending").toUpperCase()}
                </span>

                {isAdmin && item.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => markAsPaid(item._id)}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

    </section>
  );
};

export default Payroll;