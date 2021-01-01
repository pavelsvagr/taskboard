import React from "react"
import { Pagination } from "antd"
import PropTypes from "prop-types"

function DataPagination({
  offset,
  limit,
  count,
  search = null,
  sort,
  onFetch,
  size = "small",
  showSizeChanger,
}) {
  const className = limit >= count ? "no-paginate" : ""
  let handleChange
  if (search !== null) {
    handleChange = (page, pageSize) => onFetch(search, page - 1, pageSize, sort)
  } else {
    handleChange = (page, pageSize) => onFetch(page - 1, pageSize, sort)
  }

  return (
    <Pagination
      size={size}
      responsive
      className={className}
      showSizeChanger={showSizeChanger}
      current={offset + 1}
      pageSize={limit}
      total={count}
      pageSizeOptions={[5, 10, 25, 50]}
      onChange={handleChange}
    />
  )
}

DataPagination.propTypes = {
  size: PropTypes.string,
  showSizeChanger: PropTypes.bool,
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  sort: PropTypes.objectOf(PropTypes.number),
  search: PropTypes.string,
  onFetch: PropTypes.func.isRequired,
}

DataPagination.defaultProps = {
  size: "small",
  sort: null,
  search: "",
  showSizeChanger: false,
}

export default DataPagination
