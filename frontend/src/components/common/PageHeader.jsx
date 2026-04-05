import React from 'react';
import { BsHouseFill, BsChevronRight } from 'react-icons/bs';

function PageHeader({ title, subtitle, breadcrumb, actions }) {
  return (
    <div className="page-header d-flex align-items-start justify-content-between flex-wrap gap-3">
      <div>
        {breadcrumb && (
          <div className="breadcrumb-nav">
            <BsHouseFill />
            <BsChevronRight style={{ fontSize: '0.6rem' }} />
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={i}>
                <span className={i === breadcrumb.length - 1 ? 'active' : ''}>{crumb}</span>
                {i < breadcrumb.length - 1 && <BsChevronRight style={{ fontSize: '0.6rem' }} />}
              </React.Fragment>
            ))}
          </div>
        )}
        <h4>{title}</h4>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="d-flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export default PageHeader;
