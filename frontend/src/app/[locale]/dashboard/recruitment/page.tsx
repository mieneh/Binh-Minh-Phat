"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { t } from "@/i18n";
import { toast } from "react-toastify";

import {
  departmentService,
  Department,
} from "@/lib/services/department.service";
import { positionService, Position } from "@/lib/services/position.service";
import {
  recruitmentService,
  Recruitment,
} from "@/lib/services/recruitment.service";

import DepartmentTable from "@/components/dashboard/departments/DepartmentTable";
import DepartmentModal from "@/components/dashboard/departments/DepartmentModal";
import DepartmentDeleteModal from "@/components/dashboard/departments/DepartmentDeleteModal";

import PositionTable from "@/components/dashboard/positions/PositionTable";
import PositionModal from "@/components/dashboard/positions/PositionModal";
import PositionDeleteModal from "@/components/dashboard/positions/PositionDeleteModal";

import RecruitmentTable from "@/components/dashboard/recruitments/RecruitmentTable";
import RecruitmentModal from "@/components/dashboard/recruitments/RecruitmentModal";
import RecruitmentDeleteModal from "@/components/dashboard/recruitments/RecruitmentDeleteModal";
import RecruitmentCloseModal from "@/components/dashboard/recruitments/RecruitmentCloseModal";

type Tab = "department" | "position" | "recruitment";

type Mode = "create" | "edit" | "detail";

export default function RecruitmentsPage() {
  const { locale } = useParams() as { locale: "vi" | "en" };

  const [activeTab, setActiveTab] = useState<Tab>("department");

  // ================= DEPARTMENT STATE =================
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [savingDepartment, setSavingDepartment] = useState(false);
  const [deleteDepartmentTarget, setDeleteDepartmentTarget] =
    useState<Department | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState(false);
  const isEditingDepartment = Boolean(editingDepartment);

  // ================= POSITION STATE =================
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [positionModalMode, setPositionModalMode] = useState<Mode>("create");
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [savingPosition, setSavingPosition] = useState(false);
  const [deletePositionTarget, setDeletePositionTarget] = useState<Position | null>(null);
  const [deletingPosition, setDeletingPosition] = useState(false);

  // ================= RECRUITMENT STATE =================
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [recruitmentModalOpen, setRecruitmentModalOpen] = useState(false);
  const [recruitmentModalMode, setRecruitmentModalMode] = useState<Mode>("create");
  const [editingRecruitment, setEditingRecruitment] = useState<Recruitment | null>(null);
  const [savingRecruitment, setSavingRecruitment] = useState(false);
  const [closeRecruitmentTarget, setCloseRecruitmentTarget] = useState<Recruitment | null>(null);
  const [closingRecruitment, setClosingRecruitment] = useState(false);
  const [deleteRecruitmentTarget, setDeleteRecruitmentTarget] = useState<Recruitment | null>(null);
  const [deletingRecruitment, setDeletingRecruitment] = useState(false);

  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptRes, posRes, recRes] = await Promise.all([
        departmentService.getAll(),
        positionService.getAll(),
        recruitmentService.getAll(),
      ]);
      setDepartments(deptRes.data || []);
      setPositions(posRes.data || []);
      setRecruitments(recRes.data || []);
    } catch (error: any) {
      toast.error(error?.message || t(locale, "fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= DEPARTMENT =================
  const handleCreateDepartmentClick = () => {
    setEditingDepartment(null);
    setDepartmentModalOpen(true);
  };

  const handleEditDepartmentClick = (dept: Department) => {
    setEditingDepartment(dept);
    setDepartmentModalOpen(true);
  };

  const handleModalDepartmentClose = () => {
    if (savingDepartment) return;
    setDepartmentModalOpen(false);
    setEditingDepartment(null);
  };

  const handleSaveDepartment = async (values: {
    name: string;
    description: string;
  }) => {
    const payload = {
      name: values.name.trim(),
      description: values.description.trim() || undefined,
    };
    try {
      setSavingDepartment(true);
      if (editingDepartment) {
        const res = await departmentService.update(
          editingDepartment._id,
          payload
        );
        toast.success(res.message);
      } else {
        const res = await departmentService.create(payload);
        toast.success(res.message);
      }
      await fetchData();
      setDepartmentModalOpen(false);
      setEditingDepartment(null);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setSavingDepartment(false);
    }
  };

  const handleDeleteDepartmentClick = (dept: Department) => {
    setDeleteDepartmentTarget(dept);
  };

  const handleDeleteDepartmentConfirm = async () => {
    if (!deleteDepartmentTarget) return;
    try {
      setDeletingDepartment(true);
      const res = await departmentService.remove(deleteDepartmentTarget._id);
      toast.success(res.message);
      await fetchData();
      setDeleteDepartmentTarget(null);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setDeletingDepartment(false);
    }
  };

  const handleDeleteDepartmentClose = () => {
    if (deletingDepartment) return;
    setDeleteDepartmentTarget(null);
  };

  // ================= POSITION HANDLERS =================
  const handleCreatePositionClick = () => {
    setEditingPosition(null);
    setPositionModalMode("create");
    setPositionModalOpen(true);
  };

  const handleEditPositionClick = (position: Position) => {
    setEditingPosition(position);
    setPositionModalMode("edit");
    setPositionModalOpen(true);
  };

  const handleDetailPositionClick = (position: Position) => {
    setEditingPosition(position);
    setPositionModalMode("detail");
    setPositionModalOpen(true);
  };

  const handlePositionModalClose = () => {
    if (savingPosition) return;
    setPositionModalOpen(false);
    setEditingPosition(null);
    setPositionModalMode("create");
  };

  const handleSwitchToEditPosition = () => {
    if (!editingPosition) return;
    setPositionModalMode("edit");
  };

  const handleSavePosition = async (values: {
    code: string;
    name: string;
    departmentId: string;
    description?: string;
    requirement?: string;
  }) => {
    const payload = {
      code: values.code.trim(),
      name: values.name.trim(),
      departmentId: values.departmentId.trim(),
      description: values.description?.trim() || undefined,
      requirement: values.requirement?.trim() || undefined,
    };
    try {
      setSavingPosition(true);
      if (editingPosition) {
        const res = await positionService.update(editingPosition.code, payload);
        toast.success(res.message);
      } else {
        const res = await positionService.create(payload);
        toast.success(res.message);
      }
      await fetchData();
      setPositionModalOpen(false);
      setEditingPosition(null);
      setPositionModalMode("create");
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setSavingPosition(false);
    }
  };

  const handleDeletePositionClick = (position: Position) => {
    setDeletePositionTarget(position);
  };

  const handleDeletePositionConfirm = async () => {
    if (!deletePositionTarget) return;
    try {
      setDeletingPosition(true);
      const res = await positionService.remove(deletePositionTarget.code);
      toast.success(res.message);
      await fetchData();
      setDeletePositionTarget(null);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setDeletingPosition(false);
    }
  };

  const handleDeletePositionClose = () => {
    if (deletingPosition) return;
    setDeletePositionTarget(null);
  };

  // ================= RECRUITMENT HANDLERS =================
  const handleCreateRecruitmentClick = () => {
    setEditingRecruitment(null);
    setRecruitmentModalMode("create");
    setRecruitmentModalOpen(true);
  };

  const handleEditRecruitmentClick = (recruitment: Recruitment) => {
    setEditingRecruitment(recruitment);
    setRecruitmentModalMode("edit");
    setRecruitmentModalOpen(true);
  };

  const handleDetailRecruitmentClick = (recruitment: Recruitment) => {
    setEditingRecruitment(recruitment);
    setRecruitmentModalMode("detail");
    setRecruitmentModalOpen(true);
  };

  const handleRecruitmentModalClose = () => {
    if (savingRecruitment) return;
    setRecruitmentModalOpen(false);
    setEditingRecruitment(null);
    setRecruitmentModalMode("create");
  };

  const handleSwitchToEditRecruitment = () => {
    if (!editingRecruitment) return;
    setRecruitmentModalMode("edit");
  };

  const handleSaveRecruitment = async (values: {
    positionId : string;
    address: string
    quantity: number;
    startDate: string
    deadline: string;
    experience?: number;
  }) => {
    const payload = {
      positionId: values.positionId.trim(),
      address: values.address,
      quantity: values.quantity,
      startDate: values.startDate,
      deadline: values.deadline,
      experience: values.experience === 0 ? undefined : Number(values.experience),
    };
    try {
      setSavingRecruitment(true);
      if (editingRecruitment) {
        const res = await recruitmentService.update(
          editingRecruitment._id,
          payload
        );
        toast.success(res.message);
      } else {
        const res = await recruitmentService.create(payload);
        toast.success(res.message);
      }
      await fetchData();
      setRecruitmentModalOpen(false);
      setEditingRecruitment(null);
      setRecruitmentModalMode("create");
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setSavingRecruitment(false);
    }
  };
  
  const handleCloseRecruitmentClick = (rec: Recruitment) => {
    setCloseRecruitmentTarget(rec);
  };

  const handleCloseRecruitmentConfirm = async () => {
    if (!closeRecruitmentTarget) return;
    try {
      setClosingRecruitment(true);
      const res = await recruitmentService.close(closeRecruitmentTarget._id);
      toast.success(res.message);
      await fetchData();
      setCloseRecruitmentTarget(null);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setClosingRecruitment(false);
    }
  };

  const handleCloseRecruitmentClose = () => {
    if (closingRecruitment) return;
    setCloseRecruitmentTarget(null);
  };

  const handleDeleteRecruitmentClick = (rec: Recruitment) => {
    setDeleteRecruitmentTarget(rec);
  };

  const handleDeleteRecruitmentConfirm = async () => {
    if (!deleteRecruitmentTarget) return;
    try {
      setDeletingRecruitment(true);
      const res = await recruitmentService.remove(deleteRecruitmentTarget._id);
      toast.success(res.message);
      await fetchData();
      setDeleteRecruitmentTarget(null);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setDeletingRecruitment(false);
    }
  };

  const handleDeleteRecruitmentClose = () => {
    if (deletingRecruitment) return;
    setDeleteRecruitmentTarget(null);
  };

  if (loading) {
    return <p>{t(locale, "loading")}</p>;
  }

  return (
    <div className="w-full">
      {/* ================= TABS ================= */}
      <div className="mb-4 flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("department")}
          className={`pb-2 ${
            activeTab === "department"
              ? "border-b-2 border-emerald-600 font-medium"
              : "opacity-70"
          }`}
        >
          {t(locale, "department")}
        </button>
        <button
          onClick={() => setActiveTab("position")}
          className={`pb-2 ${
            activeTab === "position"
              ? "border-b-2 border-emerald-600 font-medium"
              : "opacity-70"
          }`}
        >
          {t(locale, "position")}
        </button>
        <button
          onClick={() => setActiveTab("recruitment")}
          className={`pb-2 ${
            activeTab === "recruitment"
              ? "border-b-2 border-emerald-600 font-medium"
              : "opacity-70"
          }`}
        >
          {t(locale, "recruitment")}
        </button>
      </div>

      {/* ================= DEPARTMENT TAB ================= */}
      {activeTab === "department" && (
        <>
          <button
            type="button"
            onClick={handleCreateDepartmentClick}
            className="w-full mb-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            {t(locale, "create")}
          </button>

          <DepartmentTable
            locale={locale}
            departments={departments}
            onEdit={handleEditDepartmentClick}
            onDelete={handleDeleteDepartmentClick}
          />

          <DepartmentModal
            locale={locale}
            open={departmentModalOpen}
            mode={isEditingDepartment ? "edit" : "create"}
            submitting={savingDepartment}
            initialValues={
              editingDepartment
                ? {
                    name: editingDepartment.name,
                    description: editingDepartment.description || "",
                  }
                : undefined
            }
            onClose={handleModalDepartmentClose}
            onSubmit={handleSaveDepartment}
          />

          <DepartmentDeleteModal
            open={Boolean(deleteDepartmentTarget)}
            loading={deletingDepartment}
            onClose={handleDeleteDepartmentClose}
            onConfirm={handleDeleteDepartmentConfirm}
          />
        </>
      )}

      {/* ================= POSITION TAB ================= */}
      {activeTab === "position" && (
        <>
          <button
            type="button"
            onClick={handleCreatePositionClick}
            className="w-full mb-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            {t(locale, "create")}
          </button>

          <PositionTable
            locale={locale}
            positions={positions}
            onEdit={handleEditPositionClick}
            onDelete={handleDeletePositionClick}
            onDetail={handleDetailPositionClick}
          />

          <PositionModal
            locale={locale}
            open={positionModalOpen}
            mode={positionModalMode}
            submitting={savingPosition}
            initialValues={
              editingPosition
                ? {
                    code: editingPosition.code || "",
                    name: editingPosition.name || "",
                    departmentId:
                      typeof editingPosition.departmentId === "string"
                        ? editingPosition.departmentId
                        : editingPosition.departmentId?._id || "",
                    description: editingPosition.description || "",
                    requirement: editingPosition.requirement || "",
                  }
                : undefined
            }
            position={editingPosition || undefined}
            onClose={handlePositionModalClose}
            onSubmit={handleSavePosition}
            onSwitchToEdit={handleSwitchToEditPosition}
          />

          <PositionDeleteModal
            open={Boolean(deletePositionTarget)}
            loading={deletingPosition}
            onClose={handleDeletePositionClose}
            onConfirm={handleDeletePositionConfirm}
          />
        </>
      )}

      {/* ================= RECRUITMENT TAB ================= */}
      {activeTab === "recruitment" && (
        <>
          <button
            type="button"
            onClick={handleCreateRecruitmentClick}
            className="w-full mb-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            {t(locale, "create")}
          </button>

          <RecruitmentTable
            locale={locale}
            recruitments={recruitments}
            onEdit={handleEditRecruitmentClick}
            onClose={handleCloseRecruitmentClick}
            onDelete={handleDeleteRecruitmentClick}
            onDetail={handleDetailRecruitmentClick}
          />

          <RecruitmentModal
            locale={locale}
            open={recruitmentModalOpen}
            mode={recruitmentModalMode}
            submitting={savingRecruitment}
            initialValues={
              editingRecruitment
                ? {
                    positionId:
                      typeof editingRecruitment.positionId === "string"
                        ? editingRecruitment.positionId
                        : editingRecruitment.positionId?.code || "",
                    address: editingRecruitment.address.toString() || "",
                    quantity: editingRecruitment.quantity || 0,
                    startDate: editingRecruitment.startDate
                      ? new Date(editingRecruitment.startDate)
                          .toISOString()
                          .split("T")[0]
                      : "",
                    deadline: editingRecruitment.deadline
                      ? new Date(editingRecruitment.deadline)
                          .toISOString()
                          .split("T")[0]
                      : "",
                    experience: editingRecruitment.experience || undefined
                  }
                : undefined
            }
            recruitment={editingRecruitment || undefined}
            onClose={handleRecruitmentModalClose}
            onSubmit={handleSaveRecruitment}
            onSwitchToEdit={handleSwitchToEditRecruitment}
          />

          <RecruitmentCloseModal
            open={Boolean(closeRecruitmentTarget)}
            loading={closingRecruitment}
            onClose={handleCloseRecruitmentClose}
            onConfirm={handleCloseRecruitmentConfirm}
          />

          <RecruitmentDeleteModal
            open={Boolean(deleteRecruitmentTarget)}
            loading={deletingRecruitment}
            onClose={handleDeleteRecruitmentClose}
            onConfirm={handleDeleteRecruitmentConfirm}
          />
        </>
      )}
    </div>
  );
}
