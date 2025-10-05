export default function TextWithLine({ text }: { text: string }) {
  return (
    <div className="text-[9px] text-neutral-500 flex items-center gap-1 w-full px-2">
      <div className="content-none border-t border-neutral-200 grow h-[1px]"></div>
      <div>{text}</div>
      <div className="content-none border-t border-neutral-300 grow h-[1px]"></div>
    </div>
  );
}
