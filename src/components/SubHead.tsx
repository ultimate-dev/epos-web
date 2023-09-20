class SubHeadProps {
  head?: string;
  badge?: number;
}
const SubHead = ({ head, badge }: SubHeadProps) => {
  return (
    <div className="w-full px-2 mt-2 flex">
      <span className="text-lg font-medium text-gray-500">{head}</span>
      <div className="flex items-center justify-center ml-2 bg-white rounded px-2">
        <span className="-mb-0.5 text-primary text-xs font-medium">{badge}</span>
      </div>
    </div>
  );
};
export default SubHead;
