import RecipeCard from './components/recipe-card';
import Flow from './flow';
import { getRecipes } from './data/recipes';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './components/ui/input-group';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { getMaterial } from './data/materials';

function App() {
  const [query, setQuery] = useState('');

  const recipes = getRecipes();
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.outputs
      .map((x) => getMaterial(x.materialId))
      .map((x) => x.name)
      .some((name) => name.toLowerCase().indexOf(query.toLowerCase()) !== 1)
  );

  return (
    <>
      <div className="h-[100vh] flex flex-col">
        <nav className="bg-neutral-800 h-16 flex items-center p-4 text-white">
          <span className="font-bold text-xl text-[#e69710]">
            Captain of Industry calculator
          </span>
        </nav>
        <div className="flex h-full">
          <div className="border-r bg-slate-50 border-r-slate-200 p-4 w-[24em] flex flex-col items-center gap-2">
            <InputGroup className="rounded bg-white shadow">
              <InputGroupInput
                placeholder="Search for output..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              {query.length > 0 && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size={'icon-xs'}
                    onClick={() => setQuery('')}
                  >
                    <X />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.recipeId} recipe={recipe}></RecipeCard>
            ))}
          </div>
          <div className="h-[100%] flex-1">
            <Flow></Flow>
            <div id="tooltip-root" />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
