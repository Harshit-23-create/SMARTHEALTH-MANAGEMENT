import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API_BASE_URL from "@/utils/api";

const PatientDetailsPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/patients`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p._id === id);
        setPatient(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!patient) {
    return <DashboardLayout>Loading...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Patient Details</h1>

        <div className="bg-white p-6 rounded-lg shadow space-y-3">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Disease:</strong> {patient.disease}</p>
          <p><strong>Bed:</strong> {patient.bed}</p>
          <p><strong>Status:</strong> {patient.status}</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDetailsPage;