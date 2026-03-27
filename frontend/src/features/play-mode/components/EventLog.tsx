import { useEffect, useRef } from 'react';
import { PHASES } from '../stores/gameSessionStore';
import type { GameSessionEvent } from '../../../shared/types/database';

interface EventLogProps {
  events: GameSessionEvent[];
}

export function EventLog({ events }: EventLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events.length]);

  const eventsByRound = new Map<number, GameSessionEvent[]>();
  for (const event of events) {
    const existing = eventsByRound.get(event.round) ?? [];
    existing.push(event);
    eventsByRound.set(event.round, existing);
  }

  const sortedRounds = Array.from(eventsByRound.keys()).sort((a, b) => a - b);

  if (events.length === 0) {
    return (
      <div className="event-log">
        <p className="event-log__empty">No events recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="event-log">
      {sortedRounds.map((round) => {
        const roundEvents = eventsByRound.get(round)!;
        return (
          <div key={round} className="event-log__round">
            <div className="event-log__round-header">Round {round}</div>
            {roundEvents.map((event) => (
              <div key={event.id} className="event-log__item">
                <span className="event-log__phase">
                  {PHASES[event.phase] ?? 'Unknown'}
                </span>
                <span className="event-log__type">{event.event_type}</span>
                <span className="event-log__description">{event.description}</span>
                <span className="event-log__time">
                  {new Date(event.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
