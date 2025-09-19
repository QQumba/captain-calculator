import Flow from './flow';

function App() {
  return (
    <>
      <div className="h-[100vh] flex flex-col">
        <nav className="bg-neutral-700 h-16 flex items-center p-4 text-white">
          <span className="font-bold text-xl">Captail of Industry calculator</span>
        </nav>
        <div className="flex h-full">
          <div className="border-r bg-slate-50 border-r-slate-200 p-4 w-[16em] flex flex-col items-center">
            Sidebar
          </div>
          <div className="h-[100%] flex-1">
            <Flow></Flow>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
