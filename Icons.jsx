const IconBase = ({ className, title, children, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden={title ? "false" : "true"}
    role="img"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {title ? <title>{title}</title> : null}
    {children}
  </svg>
);

export const HomeIcon = ({ className }) => (
  <IconBase className={className} title="Dashboard">
    <path d="M3 11L12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" />
  </IconBase>
);

export const CustomersIcon = ({ className }) => (
  <IconBase className={className} title="Customers">
    <path d="M6 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M2 20c0-2.2 3.6-4 8-4s8 1.8 8 4" />
  </IconBase>
);

export const LeadsIcon = ({ className }) => (
  <IconBase className={className} title="Leads">
    <path d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2z" />
    <path d="M7 6h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
  </IconBase>
);

export const PipelineIcon = ({ className }) => (
  <IconBase className={className} title="Pipeline value">
    <path d="M4 16l4-4 4 4 4-8 4 8" />
  </IconBase>
);

export const AddIcon = ({ className }) => (
  <IconBase className={className} title="Add">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </IconBase>
);

export const CancelIcon = ({ className }) => (
  <IconBase className={className} title="Cancel">
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </IconBase>
);

export const EditIcon = ({ className }) => (
  <IconBase className={className} title="Edit">
    <path d="M4 20h4l10-10-4-4L4 16v4z" />
    <path d="M13 7l4 4" />
  </IconBase>
);

export const DeleteIcon = ({ className }) => (
  <IconBase className={className} title="Delete">
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </IconBase>
);

export const ConvertIcon = ({ className }) => (
  <IconBase className={className} title="Convert">
    <path d="M4 7V4h3" />
    <path d="M20 17v3h-3" />
    <path d="M20 7a9 9 0 0 0-16 6" />
    <path d="M4 17a9 9 0 0 0 16-6" />
  </IconBase>
);
