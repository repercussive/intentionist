import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'tsyringe'
import HabitsHandler, { Habit } from '@/logic/app/HabitsHandler'
import generateHabitId from '@/logic/utils/generateHabitId'
import getUtcSeconds from '@/logic/utils/getUtcSeconds'
import Router from '@/types/router'

type QueryParams = {
  id: string | undefined,
  new: any
}

@injectable()
export default class HabitEditor {
  public habit
  public isNewHabit
  private habitsHandler
  private router

  constructor(habitsHandler: HabitsHandler, @inject('Router') router: Router) {
    this.habitsHandler = habitsHandler
    this.router = router

    const query = router.query as QueryParams
    if (query.new !== undefined) {
      this.isNewHabit = true
      this.habit = this.generateEmptyHabit()
    } else {
      this.isNewHabit = false
      const existingHabit = query.id ? habitsHandler.findHabitById(query.id) : null
      if (existingHabit) {
        this.habit = existingHabit
      } else {
        router.push('/home')
        return
      }
    }

    makeAutoObservable(this)
  }

  public updateHabit = (updates: Partial<Habit>) => {
    if (!this.habit) throw new Error('Cannot update undefined habit')
    this.habit = { ...this.habit, ...updates }
  }

  public deleteHabit = () => {
    if (!this.habit) throw new Error('Cannot delete undefined habit')
    this.habitsHandler.deleteHabitById(this.habit.id)
    this.exit()
  }

  public saveAndExit = () => {
    if (!this.habit) throw new Error('Cannot save undefined habit')
    this.habitsHandler.setHabit(this.habit)
    this.exit()
  }

  public exit = () => {
    this.router.push('/home')
  }

  private generateEmptyHabit = (): Habit => {
    return {
      id: generateHabitId(),
      name: '',
      icon: '🙂',
      palette: ['🌟', '👍', '🤏'],
      timeable: true,
      archived: false,
      visibility: 'private',
      creationTime: getUtcSeconds()
    }
  }
}