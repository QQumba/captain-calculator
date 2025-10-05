import RecipeCard from './components/recipe-card';
import Flow from './flow';
import { getRecipeIds } from './recipe-repo';

function App() {
  const recipes = getRecipeIds();

  return (
    <>
      <div className="h-[100vh] flex flex-col">
        <nav className="bg-neutral-700 h-16 flex items-center p-4 text-white">
          <span className="font-bold text-xl">
            Captain of Industry calculator
          </span>
        </nav>
        <div className="flex h-full">
          <div className="border-r bg-slate-50 border-r-slate-200 p-4 w-[24em] flex flex-col items-center gap-2">
            <div>Sidebar</div>
            {recipes.map((x) => (
              <RecipeCard key={x} recipeId={x}></RecipeCard>
            ))}
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
