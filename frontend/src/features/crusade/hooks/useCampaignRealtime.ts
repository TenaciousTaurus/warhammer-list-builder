import { useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import { useCrusadeStore } from '../stores/crusadeStore';

export function useCampaignRealtime(campaignId: string) {
  const { loadCampaign } = useCrusadeStore();

  useEffect(() => {
    if (!campaignId) return;

    const channel = supabase
      .channel(`campaign-${campaignId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaigns',
          filter: `id=eq.${campaignId}`,
        },
        () => {
          loadCampaign(campaignId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaign_members',
          filter: `campaign_id=eq.${campaignId}`,
        },
        () => {
          loadCampaign(campaignId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crusade_battles',
          filter: `campaign_id=eq.${campaignId}`,
        },
        () => {
          loadCampaign(campaignId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId, loadCampaign]);
}
