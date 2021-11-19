import { container } from 'tsyringe'
import { observer } from 'mobx-react-lite'
import { forwardRef, useState } from 'react'
import { DragStartEvent, DragEndEvent, DragOverlay, DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, } from '@dnd-kit/sortable'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import HabitsHandler, { Habit } from '@/logic/app/HabitsHandler'
import useAutorun from '@/hooks/useAutorun'
import DragHandle, { DragHandleProps } from '@/components/app/DragHandle'
import SmartEmoji from '@/components/app/SmartEmoji'
import Button from '@/components/primitives/Button'
import Flex from '@/components/primitives/Flex'
import Icon from '@/components/primitives/Icon'
import PencilIcon from '@/components/icons/PencilIcon'
import NextLink from 'next/link'

function createHabitsMap(habits: Habit[]) {
  return habits.reduce<{ [habitId: string]: Habit }>((map, habit) => {
    map[habit.id] = habit
    return map
  }, {})
}

const FilteredHabitsList = () => {
  const { activeHabits, reorderHabits, findHabitById } = container.resolve(HabitsHandler)
  const [draggedHabitId, setDraggedHabitId] = useState<string | null>(null)

  const [habitsMap, setHabitsMap] = useState(createHabitsMap(activeHabits))

  useAutorun(() => {
    if (activeHabits.length !== Object.keys(habitsMap).length) {
      setHabitsMap(createHabitsMap(activeHabits))
    }
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={activeHabits}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {activeHabits.map(habit => <SortableHabit habit={habit} key={habit.id} />)}
        </div>
      </SortableContext>
      <DragOverlay>
        {!!draggedHabitId && <HabitWrapper isDragOverlay habit={habitsMap[draggedHabitId]} />}
      </DragOverlay>
    </DndContext>
  )

  function handleDragStart(event: DragStartEvent) {
    setDraggedHabitId(event.active.id)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over?.id && active.id !== over.id) {
      const habitToMove = findHabitById(active.id)
      const takesPlaceOf = findHabitById(over.id)
      if (habitToMove && takesPlaceOf) {
        reorderHabits(habitToMove, takesPlaceOf)
      }
    }
    setDraggedHabitId(null)
  }
}

const SortableHabit = ({ habit }: { habit: Habit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: habit.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <HabitWrapper
      habit={habit}
      ref={setNodeRef}
      style={style}
      attributes={attributes}
      listeners={listeners}
      isDragging={isDragging}
    />
  )
}

interface HabitWrapperProps extends DragHandleProps {
  habit: Habit,
  isDragging?: boolean,
  style?: {
    transform: string | undefined
    transition: string | undefined
  }
}

const HabitWrapper = forwardRef(function HabitWrapper(props: HabitWrapperProps, ref: any) {
  const { habit, isDragging, isDragOverlay, style, listeners, attributes } = props

  return (
    <Flex
      ref={ref}
      sx={{
        marginBottom: 2,
        backgroundColor: isDragOverlay ? 'whiteAlpha.20' : 'transparent',
        borderRadius: 'default',
        opacity: isDragging ? 0 : 1
      }}
      style={style}
    >
      <DragHandle listeners={listeners} attributes={attributes} isDragOverlay={isDragOverlay} />
      <div sx={{ pointerEvents: isDragOverlay ? 'none' : 'auto', width: '100%' }}>
        <HabitLink habit={habit} />
      </div>
    </Flex>
  )
})

const HabitLink = observer(({ habit }: { habit: Habit }) => {
  return (
    <NextLink href={`/habit?id=${habit.id}`}>
      <Button
        sx={{
          width: '100%', px: 3,
          backgroundColor: 'transparent',
          textAlign: 'left',
          'svg': { opacity: 0.25, },
          '&:hover svg': {
            opacity: 1
          }
        }}
      >
        <Flex center justify="flex-start" sx={{ maxWidth: '100%', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
          <Flex center sx={{ mr: [3, 4], width: '1.3rem' }}>
            <SmartEmoji nativeEmoji={habit.icon} rem={1.3} />
          </Flex>
          {habit.name}
          <Icon icon={PencilIcon} sx={{ ml: 'auto', pl: 2, fontSize: '1.1rem' }} />
        </Flex>
      </Button>
    </NextLink>
  )
})

export default observer(FilteredHabitsList)