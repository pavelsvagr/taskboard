import React from "react"
import { Pagination } from "antd"
import PropTypes from "prop-types"

function DataPagination({
  offset,
  limit,
  count,
  search,
  sort,
  onFetch,
  size = "small",
  showSizeChanger,
}) {
  const className = limit >= count ? "no-paginate" : ""

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
      onChange={(page, pageSize) => onFetch(search, page - 1, pageSize, sort)}
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
