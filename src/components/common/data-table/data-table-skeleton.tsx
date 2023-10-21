import React from "react";

const DataTableSkelton = () => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between animate-pulse">
        <div className="flex items-center gap-2 w-full">
          <div className="shadow rounded-md h-8 w-1/4 bg-primary/50" />
          <div className="shadow rounded-md h-7 w-1/12 bg-primary/50" />
          <div className="shadow rounded-md h-7 w-1/12 bg-primary/50" />
          <div className="shadow rounded-md h-7 w-1/12 bg-primary/50" />
        </div>
        <div className="shadow rounded-md h-7 w-1/12 bg-primary/50" />
      </div>
      <div className="animate-pulse border shadow rounded-md p-4 w-full mx-auto">
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-primary/50 rounded" />
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-primary/50 rounded col-span-2" />
              <div className="h-2 bg-primary/50 rounded col-span-1" />
            </div>
            <div className="h-2 bg-primary/50 rounded" />
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-primary/50 rounded col-span-1" />
              <div className="h-2 bg-primary/50 rounded col-span-2" />
            </div>
            <div className="h-2 bg-primary/50 rounded" />
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-6 gap-4">
              <div className="h-2 bg-primary/50 rounded col-span-1" />
              <div className="h-2 bg-primary/50 rounded col-span-2" />
              <div className="h-2 bg-primary/50 rounded col-span-3" />
            </div>
            <div className="h-2 bg-primary/50 rounded" />
          </div>
        </div>
      </div>
      <div className="animate-pulse rounded-md p-4 w-full mx-auto">
        <div className="space-y-3">
          <div className="flex justify-between items-center ">
            <div className="h-2 bg-primary/50 rounded col-span-1 w-1/6" />
            <div className="flex justify-between items-center w-1/2">
              <div className="h-2 bg-primary/50 rounded w-1/4" />
              <div className="shadow rounded-md h-7 w-1/6 bg-primary/50" />
              <div className="flex gap-2">
                <div className="rounded-full bg-primary/50 h-6 w-6" />
                <div className="rounded-full bg-primary/50 h-6 w-6" />
                <div className="rounded-full bg-primary/50 h-6 w-6" />
                <div className="rounded-full bg-primary/50 h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableSkelton;
