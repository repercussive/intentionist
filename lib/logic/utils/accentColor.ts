import { makeAutoObservable } from 'mobx'
import { WeekViewMode } from '../app/WeeksHandler'

export type AccentColor = WeekViewMode | 'neutral' | 'off'

const accentColor = makeAutoObservable({
  current: 'off' as AccentColor,
  set(accent: AccentColor) { this.current = accent }
})

export default accentColor