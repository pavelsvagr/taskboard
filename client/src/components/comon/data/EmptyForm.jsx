import React from "react"
import { Skeleton } from "antd"

function EmptyForm() {
  return (
    <div>
      <div className=" p-sm">
        <Skeleton.Input active style={{ width: 200 }} />
      </div>
      <div className="p-sm">
        <Skeleton.Input active style={{ width: 200 }} />
      </div>
      <div className="p-sm">
        <Skeleton.Input active style={{ width: 200 }} />
      </div>
      <div className="text-right p-sm">
        <Skeleton.Button active />
      </div>
    </div>
  )
}

export default EmptyForm