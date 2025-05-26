
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

export function Calendar({ className, ...props }) {
  return (
    <div className="p-3 rounded border">
      <DayPicker
        className={className}
        {...props}
      />
    </div>
  )
}
