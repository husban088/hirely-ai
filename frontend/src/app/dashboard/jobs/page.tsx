"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Plus,
  X,
  Building2,
  MapPin,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MY_JOBS_QUERY } from "@/lib/graphql/queries";
import {
  CREATE_JOB_MUTATION,
  UPDATE_JOB_MUTATION,
  DELETE_JOB_MUTATION,
} from "@/lib/graphql/mutations";

const COLUMNS = [
  { id: "WISHLIST", label: "Wishlist", color: "border-slate-400/40" },
  { id: "APPLIED", label: "Applied", color: "border-blue-400/40" },
  { id: "INTERVIEW", label: "Interview", color: "border-gold/50" },
  { id: "OFFER", label: "Offer", color: "border-emerald-400/40" },
  { id: "REJECTED", label: "Rejected", color: "border-red-400/40" },
];

export default function JobsPage() {
  const { data, refetch } = useQuery(MY_JOBS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const [createJob] = useMutation(CREATE_JOB_MUTATION);
  const [updateJob] = useMutation(UPDATE_JOB_MUTATION);
  const [deleteJob] = useMutation(DELETE_JOB_MUTATION);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    jobUrl: "",
  });

  const jobs = data?.myJobs || [];

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId;
    const jobId = result.draggableId;
    if (result.source.droppableId === newStatus) return;

    try {
      await updateJob({
        variables: { input: { id: jobId, status: newStatus } },
      });
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Update failed.");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createJob({
        variables: { input: { ...form, status: "WISHLIST" } },
      });
      toast.success("Application added!");
      setForm({ jobTitle: "", companyName: "", location: "", jobUrl: "" });
      setModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to add.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteJob({ variables: { id } });
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Job <span className="gold-text">Tracker</span>
          </h1>
          <p className="mt-1 text-ivory/50">
            Drag applications across stages as they progress.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Job
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="mt-8 grid grid-cols-1 gap-4 overflow-x-auto pb-4 sm:grid-cols-2 lg:grid-cols-5">
          {COLUMNS.map((col) => {
            const colJobs = jobs.filter((j: any) => j.status === col.id);
            return (
              <div
                key={col.id}
                className={`rounded-2xl border-t-2 bg-white/[0.02] p-3 ${col.color}`}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold text-ivory/80">
                    {col.label}
                  </h3>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-ivory/40">
                    {colJobs.length}
                  </span>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[120px] space-y-2 rounded-xl transition-colors ${snapshot.isDraggingOver ? "bg-gold/5" : ""}`}
                    >
                      {colJobs.map((job: any, index: number) => (
                        <Draggable
                          key={job.id}
                          draggableId={job.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`group glass-panel cursor-grab rounded-xl p-3 active:cursor-grabbing ${
                                snapshot.isDragging ? "shadow-gold-lg" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">
                                    {job.jobTitle}
                                  </p>
                                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-ivory/50">
                                    <Building2 className="h-3 w-3" />{" "}
                                    {job.companyName}
                                  </p>
                                  {job.location && (
                                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-ivory/40">
                                      <MapPin className="h-3 w-3" />{" "}
                                      {job.location}
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleDelete(job.id)}
                                  className="opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-ivory/30 hover:text-red-600" />
                                </button>
                              </div>
                              {job.jobUrl && (
                                <a
                                  href={job.jobUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-2 flex items-center gap-1 text-xs text-gold hover:underline"
                                >
                                  <LinkIcon className="h-3 w-3" /> View posting
                                </a>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-gold-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">
                  Add Application
                </h3>
                <button onClick={() => setModalOpen(false)}>
                  <X className="h-5 w-5 text-ivory/40" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-3">
                <Input
                  placeholder="Job title"
                  required
                  value={form.jobTitle}
                  onChange={(e) =>
                    setForm({ ...form, jobTitle: e.target.value })
                  }
                />
                <Input
                  placeholder="Company name"
                  required
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                />
                <Input
                  placeholder="Location (optional)"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
                <Input
                  placeholder="Job posting URL (optional)"
                  value={form.jobUrl}
                  onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
                />
                <Button type="submit" fullWidth>
                  Add to Wishlist
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
