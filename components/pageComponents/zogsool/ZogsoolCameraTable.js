import { Table } from "antd";

import React from "react";

const ZogsoolCameraTable = ({
  uilchluulegchGaralt,
  columns,
  onChangeTable,
  setUilchluulegchKhuudaslalt,
  isValidating,
  summary,
}) => {
  return (
    <div>
      <Table
        className="cameraTable mt-2 hidden overflow-auto md:block"
        tableLayout="auto"
        dataSource={uilchluulegchGaralt?.jagsaalt}
        scroll={{ y: "calc(100vh - 47.5rem)" }}
        size="small"
        bordered
        rowKey={(row) => row._id}
        columns={columns}
        onChange={onChangeTable}
        loading={isValidating}
        summary={summary}
        rowClassName={(record, index) => {
          const d = record.tuukh[0];
          if (d.tuluv === 0 && record.turul !== "Үнэгүй" && d?.tulukhDun)
            return "green";
        }}
        pagination={{
          current: uilchluulegchGaralt?.khuudasniiDugaar,
          pageSize: uilchluulegchGaralt?.khuudasniiKhemjee,
          total: uilchluulegchGaralt?.niitMur,
          showSizeChanger: true,
          onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
            setUilchluulegchKhuudaslalt((kh) => ({
              ...kh,
              khuudasniiDugaar,
              khuudasniiKhemjee,
            })),
        }}
      />
    </div>
  );
};

export default ZogsoolCameraTable;
