import { environment } from 'src/environments/environment';

export function getDefaultFromTo() {
  const from = new Date();
  const to = new Date();
    
  from.setHours(23);
  from.setMinutes(59);

  if (!environment.production) { 
    from.setFullYear(2015, 1);
  }

  return { from, to };
}
