import { Button, Table } from '@contentful/f36-components'
import * as icons from '@contentful/f36-icons'
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRef, useState } from 'react'
import { ObjectSchema } from '../types'
import SchemaEditor from './SchemaEditor'

interface Item {
  id: string
  data: Record<string, any>
}

interface SortableRowProps {
  id: string
  index: number
  itemSchema: ObjectSchema
  data: Record<string, any>
  onDataChange: (newData: Record<string, any>) => void
  onRemove: () => void
}

const SortableRow = ({ id, index, itemSchema, data, onDataChange, onRemove }: SortableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell
              style={{ width: 32, cursor: isDragging ? 'grabbing' : 'grab', color: '#8091a5' }}
              {...attributes}
              {...listeners}
            >
              <icons.DragIcon />
            </Table.Cell>
            <Table.Cell style={{ width: 40, color: '#8091a5' }}>#{index + 1}</Table.Cell>
            <Table.Cell>
              <SchemaEditor schema={itemSchema} initialValue={data} onChange={onDataChange} />
            </Table.Cell>
            <Table.Cell style={{ width: 32 }}>
              <span style={{ cursor: 'pointer' }} onClick={onRemove}>
                <icons.CloseTrimmedIcon variant="negative" />
              </span>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  )
}

interface Props {
  itemSchema: ObjectSchema
  value: Record<string, any>[]
  onChange: (value: Record<string, any>[]) => void
}

const ArrayField = ({ itemSchema, value, onChange }: Props) => {
  const counter = useRef(0)
  const [items, setItems] = useState<Item[]>(() =>
    (value ?? []).map(data => ({ id: `item-${counter.current++}`, data }))
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const commit = (next: Item[]) => {
    setItems(next)
    onChange(next.map(i => i.data))
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = items.findIndex(i => i.id === active.id)
    const to = items.findIndex(i => i.id === over.id)
    commit(arrayMove(items, from, to))
  }

  const handleDataChange = (id: string, newData: Record<string, any>) => {
    const next = items.map(item => (item.id === id ? { ...item, data: newData } : item))
    setItems(next)
    onChange(next.map(i => i.data))
  }

  const addItem = () => commit([...items, { id: `item-${counter.current++}`, data: {} }])
  const removeItem = (id: string) => commit(items.filter(i => i.id !== id))

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item, idx) => (
            <SortableRow
              key={item.id}
              id={item.id}
              index={idx}
              itemSchema={itemSchema}
              data={item.data}
              onDataChange={newData => handleDataChange(item.id, newData)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <hr color="#E7EBEE" style={{ margin: '8px 0' }} />
      <Button size="small" startIcon={<icons.PlusIcon />} variant="primary" onClick={addItem}>
        Add
      </Button>
    </>
  )
}

export default ArrayField
