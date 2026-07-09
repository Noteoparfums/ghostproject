import { useState } from 'react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { useApi } from '../../hooks/useApi';
import { usePagination } from '../../hooks/usePagination';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { projectsApi, Project } from '../../api/endpoints/projects';
import { createProjectBody } from '@ghostwriter/shared';
import DataTable from '../../components/ui/DataTable';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Field from '../../components/ui/Field';
import Input from '../../components/ui/Input';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../lib/date';
import { FolderPlus, Trash, Archive, FolderOpen, AlertTriangle } from 'lucide-react';
import { track } from '../../lib/analytics';

export function Projects() {
  useDocumentMeta({
    title: 'Projects',
  });

  const toast = useToast();
  const { page, setPage, perPage } = usePagination();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch paginated projects
  const { data: projectsPayload, loading, refetch } = useApi(
    () => projectsApi.list(page),
    [page]
  );

  // Fetch assets for selected project details pane
  const { data: assetsData, loading: loadingAssets } = useApi(
    (signal) => selectedProject ? projectsApi.listAssets(selectedProject.id) : Promise.resolve([]),
    [selectedProject]
  );

  // Project creation form
  const createForm = useForm({
    schema: createProjectBody,
    initial: {
      name: '',
      description: '',
    },
    onSubmit: async (values) => {
      try {
        await projectsApi.create(values);
        toast.success('Project created successfully!');
        setIsCreateOpen(false);
        createForm.setValue('name', '');
        createForm.setValue('description', '');
        refetch();
        track('first_project_created');
      } catch (err: any) {
        toast.error(err.message || 'Failed to create project');
      }
    },
  });

  // Archive Project Toggle
  const handleToggleArchive = async (project: Project) => {
    const nextStatus = project.status === 'active' ? 'archived' : 'active';
    try {
      await projectsApi.update(project.id, { status: nextStatus });
      toast.success(`Project ${nextStatus === 'archived' ? 'archived' : 'activated'} successfully.`);
      refetch();
      if (selectedProject?.id === project.id) {
        setSelectedProject((prev) => prev ? { ...prev, status: nextStatus } : null);
      }
    } catch (err: any) {
      toast.error(`Archive transition failed: ${err.message}`);
    }
  };

  // Delete project
  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await projectsApi.delete(projectToDelete.id);
      toast.success('Project deleted successfully.');
      refetch();
      if (selectedProject?.id === projectToDelete.id) {
        setSelectedProject(null);
      }
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setProjectToDelete(null);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Project Name',
      render: (row: Project) => (
        <button
          onClick={() => setSelectedProject(row)}
          className="text-left font-bold dark:text-zinc-100 text-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
        >
          {row.name}
        </button>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: Project) => (
        <Badge tone={row.status === 'active' ? 'success' : 'default'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Created Date',
      render: (row: Project) => formatDate(row.created_at),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: Project) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleArchive(row)}
            className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            title={row.status === 'active' ? 'Archive Project' : 'Activate Project'}
          >
            <Archive className="w-4 h-4" />
          </button>
          <button
            onClick={() => setProjectToDelete(row)}
            className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-500"
            title="Delete Project"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const projects = projectsPayload?.data || [];
  const total = projectsPayload?.meta?.total || 0;

  return (
    <div className="flex flex-col gap-6 select-none min-w-0">
      {/* Header bar */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight dark:text-zinc-50 text-zinc-900">
            Projects
          </h1>
          <p className="text-xs dark:text-zinc-400 text-zinc-500 mt-1">
            Organize copywriting campaigns and marketing deliverables.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} variant="primary" size="sm">
          <FolderPlus className="w-4 h-4 mr-1.5" />
          Create Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Table view */}
        <div className="min-w-0">
          {loading ? (
            <div className="h-64 rounded-2xl border dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-zinc-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              illustration={<FolderOpen className="w-12 h-12 stroke-1" />}
              title="No projects found"
              body="Create a project to bundle copy funnel deliverables, such as Facebook ad hooks and VSL scripts."
              cta={{ label: 'Create Project', onClick: () => setIsCreateOpen(true) }}
            />
          ) : (
            <DataTable
              columns={columns}
              rows={projects.map(p => ({ ...p, id: String(p.id) })) as any}
              pagination={{
                page,
                total,
                perPage,
                onPageChange: setPage,
              }}
            />
          )}
        </div>

        {/* Selected Project Details Pane */}
        <div className="border rounded-2xl dark:border-zinc-900 border-zinc-200 bg-white dark:bg-zinc-950/20 p-6 flex flex-col gap-6">
          {selectedProject ? (
            <div className="flex flex-col gap-5 min-w-0">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm dark:text-zinc-100 text-zinc-800 truncate">
                    {selectedProject.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Created {formatDate(selectedProject.created_at)}
                  </p>
                </div>
                <Badge tone={selectedProject.status === 'active' ? 'success' : 'default'}>
                  {selectedProject.status}
                </Badge>
              </div>

              {selectedProject.description ? (
                <p className="text-xs dark:text-zinc-400 text-zinc-500 leading-relaxed select-text">
                  {selectedProject.description}
                </p>
              ) : (
                <p className="text-xs italic text-zinc-400 dark:text-zinc-600 leading-relaxed">
                  No description provided.
                </p>
              )}

              <div className="h-px bg-zinc-100 dark:bg-zinc-900" />

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                  Campaign Assets
                </h4>
                {loadingAssets ? (
                  <p className="text-xs text-zinc-500">Loading campaign deliverables...</p>
                ) : !assetsData || assetsData.length === 0 ? (
                  <p className="text-xs text-zinc-400 dark:text-zinc-600 italic">No deliverables generated for this project yet.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
                    {assetsData.map((asset: any) => (
                      <div
                        key={asset.id}
                        className="p-3 rounded-lg border dark:border-zinc-900 border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/40 text-xs flex justify-between items-center gap-4"
                      >
                        <span className="font-semibold dark:text-zinc-300 text-zinc-700 capitalize truncate">
                          {asset.asset_type.replace('_', ' ')}
                        </span>
                        {asset.copy_score && (
                          <Badge tone={asset.copy_score >= 80 ? 'success' : 'warning'}>
                            Score: {asset.copy_score}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 text-zinc-400 dark:text-zinc-600 h-64">
              <FolderOpen className="w-8 h-8 stroke-1 mb-2" />
              <p className="text-xs leading-relaxed">Select a project to inspect description and asset list.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create project modal */}
      <Modal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Project"
        size="sm"
      >
        <form onSubmit={createForm.handleSubmit} className="flex flex-col gap-4">
          <Field 
            label="Project Name" 
            id="name" 
            error={createForm.touched.name ? createForm.errors.name : undefined}
          >
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Acme SaaS Launch"
              value={createForm.values.name}
              onChange={(e) => createForm.setValue('name', e.target.value)}
              onBlur={() => createForm.handleBlur('name')}
            />
          </Field>

          <Field 
            label="Description" 
            id="description" 
            error={createForm.touched.description ? createForm.errors.description : undefined}
          >
            <Input
              id="description"
              name="description"
              multiline
              rows={4}
              placeholder="Enter details about this campaign..."
              value={createForm.values.description}
              onChange={(e) => createForm.setValue('description', e.target.value)}
              onBlur={() => createForm.handleBlur('description')}
            />
          </Field>

          <div className="flex justify-end gap-3 mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsCreateOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              size="sm"
              loading={createForm.submitting}
            >
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project?"
        body={`This actions permanently deletes the project "${projectToDelete?.name}". All associated copy funnels and assets will be unlinked.`}
        confirmLabel="Delete Project"
        variant="type-to-confirm"
        confirmText="DELETE"
      />
    </div>
  );
}
export default Projects;
