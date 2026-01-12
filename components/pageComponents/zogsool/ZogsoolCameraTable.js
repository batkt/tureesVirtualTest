import { Table } from "antd";

import React from "react";
import { useAuth } from "services/auth";

const ZogsoolCameraTable = ({
  uilchluulegchGaralt,
  columns,
  onChangeTable,
  setUilchluulegchKhuudaslalt,
  isValidating,
  summary,
}) => {
  const { isOfflineMode, isOnline } = useAuth();
  const isNavigatorOffline =
    typeof navigator !== "undefined" ? !navigator.onLine : false;
  return (
    <div className="w-full overflow-x-auto">
      {isOfflineMode || !isOnline || isNavigatorOffline ? (
        <div className="mb-2 w-full flex items-center gap-2 rounded-lg  px-3 py-1.5 bg-red-500 dark:bg-red-700 text-white  dark:text-white">
          <span className="text-sm font-medium">Интернетгүй орчинд ажиллаж байна.</span>
        </div>
      ) : null}
      <Table
        className="cameraTable mt-2"
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
          if (d?.tuluv === 0 && record.turul !== "Үнэгүй" && d?.tulukhDun)
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
