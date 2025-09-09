import React from 'react';

const SocialButton = ({ id, enabled, serverDomain, oauthPath, Icon, label }) => {
  if (!enabled || !serverDomain) {
    return null;
  }

  return (
    <div className="mt-2">
      <a
        aria-label={`${label}`}
        className="btn-social"
        href={`${serverDomain}/oauth/${oauthPath}`}
        data-testid={id}
      >
        <span className="mr-3 inline-flex h-5 w-5 items-center justify-center" aria-hidden="true">
          <Icon />
        </span>
        <span className="truncate">{label}</span>
      </a>
    </div>
  );
};

export default SocialButton;
