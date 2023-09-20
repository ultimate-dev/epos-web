import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Fragment, useState } from "react";
import Ripple from "./Ripple";
// Components

export class TabsProps {
  tabs: { name: string; content: JSX.Element | null }[];
  activeTab: number;
  onChange: (tab: number) => void;
}
const Tabs = ({ tabs = [], activeTab = 0, onChange }: TabsProps) => {
  return (
    <Fragment>
      <div className="w-full">
        <div className="flex rounded bg-white shadow">
          {tabs.map((tab, index: number) => (
            <Ripple
              onClick={() => onChange(index)}
              key={index}
              className={
                "justify-center flex-1 rounded text-center py-3 " +
                (index == activeTab && " bg-primary text-white")
              }
            >
              <div className="font-medium text-sm -mb-0.5">{tab.name}</div>
            </Ripple>
          ))}
        </div>
      </div>
      <div className="w-full h-full mt-2">{tabs[activeTab].content}</div>
    </Fragment>
  );
};
export default Tabs;
