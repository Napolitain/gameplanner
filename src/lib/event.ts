/**
 * Event class records when actions start and complete for timeline visualization
 */
export class Event {
  /** Name of the action (e.g., "Marine", "Supply Depot") */
  name: string;
  
  /** Type of event: worker, unit, structure, upgrade, or action */
  type: 'worker' | 'unit' | 'structure' | 'upgrade' | 'action';
  
  /** Frame number when the action started */
  start: number;
  
  /** Frame number when the action completed */
  end: number;
  
  /** Supply count when the action started */
  supply: number;
  
  /** Links to build order index */
  id: number;

  constructor(
    name: string,
    type: 'worker' | 'unit' | 'structure' | 'upgrade' | 'action',
    start: number,
    end: number,
    supply: number,
    id: number
  ) {
    this.name = name;
    this.type = type;
    this.start = start;
    this.end = end;
    this.supply = supply;
    this.id = id;
  }
}
