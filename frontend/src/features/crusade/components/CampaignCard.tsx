import type { Campaign } from '../../../shared/types/database';

interface CampaignCardProps {
  campaign: Campaign;
  memberCount: number;
  onClick: () => void;
}

const STATUS_LABELS: Record<Campaign['status'], string> = {
  recruiting: 'Recruiting',
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
};

export function CampaignCard({ campaign, memberCount, onClick }: CampaignCardProps) {
  const descriptionPreview = campaign.description
    ? campaign.description.length > 100
      ? campaign.description.slice(0, 100) + '...'
      : campaign.description
    : null;

  return (
    <div className="campaign-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <div className="campaign-card__header">
        <h3 className="campaign-card__name">{campaign.name}</h3>
        <span className={`campaign-card__status campaign-card__status--${campaign.status}`}>
          {STATUS_LABELS[campaign.status]}
        </span>
      </div>

      {descriptionPreview && (
        <p className="campaign-card__description">{descriptionPreview}</p>
      )}

      <div className="campaign-card__meta">
        <span className="campaign-card__meta-item">
          {campaign.points_limit} pts
        </span>
        <span className="campaign-card__meta-item">
          Max {campaign.max_players} players
        </span>
      </div>

      <div className="campaign-card__players">
        <span className="campaign-card__players-count">{memberCount}</span>
        <span>/ {campaign.max_players} players</span>
      </div>
    </div>
  );
}
