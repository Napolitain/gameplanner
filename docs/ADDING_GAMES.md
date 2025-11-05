# Tutorial: Adding a New Game

This tutorial shows you how to add a new game to Game Planner.

## Example: Adding Age of Empires II

Let's add Age of Empires II as a new supported game.

### Step 1: Open GameFactory.cpp

Navigate to `lib/src/GameFactory.cpp`

### Step 2: Create the Game Factory Method

Add this new method to create the game:

```cpp
std::shared_ptr<Game> GameFactory::CreateAgeOfEmpiresGame() {
    auto game = std::make_shared<Game>("aoe2", "Age of Empires II");
    game->SetDescription("Classic real-time strategy game by Ensemble Studios");
    
    // Dark Age units and buildings
    auto villager = std::make_shared<GameItem>("villager", "Villager", "Unit");
    villager->SetBuildTime(25.0);
    villager->AddCost(Resource("Food", 50));
    villager->SetDescription("Gathers resources and constructs buildings");
    game->AddItem(villager);
    
    auto scout = std::make_shared<GameItem>("scout", "Scout Cavalry", "Unit");
    scout->SetBuildTime(30.0);
    scout->AddCost(Resource("Food", 80));
    scout->SetDescription("Fast reconnaissance unit");
    game->AddItem(scout);
    
    auto militia = std::make_shared<GameItem>("militia", "Militia", "Unit");
    militia->SetBuildTime(21.0);
    militia->AddCost(Resource("Food", 60));
    militia->AddCost(Resource("Gold", 20));
    militia->SetDescription("Basic infantry unit");
    game->AddItem(militia);
    
    // Buildings
    auto house = std::make_shared<GameItem>("house", "House", "Building");
    house->SetBuildTime(25.0);
    house->AddCost(Resource("Wood", 25));
    house->SetDescription("Provides population capacity for 5 units");
    game->AddItem(house);
    
    auto mill = std::make_shared<GameItem>("mill", "Mill", "Building");
    mill->SetBuildTime(35.0);
    mill->AddCost(Resource("Wood", 100));
    mill->SetDescription("Used for farms and food upgrades");
    game->AddItem(mill);
    
    auto lumberCamp = std::make_shared<GameItem>("lumber_camp", "Lumber Camp", "Building");
    lumberCamp->SetBuildTime(35.0);
    lumberCamp->AddCost(Resource("Wood", 100));
    lumberCamp->SetDescription("Gathering point for wood");
    game->AddItem(lumberCamp);
    
    auto miningCamp = std::make_shared<GameItem>("mining_camp", "Mining Camp", "Building");
    miningCamp->SetBuildTime(35.0);
    miningCamp->AddCost(Resource("Wood", 100));
    miningCamp->SetDescription("Gathering point for gold and stone");
    game->AddItem(miningCamp);
    
    auto barracks = std::make_shared<GameItem>("barracks", "Barracks", "Building");
    barracks->SetBuildTime(50.0);
    barracks->AddCost(Resource("Wood", 175));
    barracks->SetDescription("Trains infantry units");
    game->AddItem(barracks);
    
    auto archeryRange = std::make_shared<GameItem>("archery_range", "Archery Range", "Building");
    archeryRange->SetBuildTime(50.0);
    archeryRange->AddCost(Resource("Wood", 175));
    archeryRange->SetDescription("Trains archers and ranged units");
    game->AddItem(archeryRange);
    
    auto stable = std::make_shared<GameItem>("stable", "Stable", "Building");
    stable->SetBuildTime(50.0);
    stable->AddCost(Resource("Wood", 175));
    stable->SetDescription("Trains cavalry units");
    game->AddItem(stable);
    
    auto blacksmith = std::make_shared<GameItem>("blacksmith", "Blacksmith", "Building");
    blacksmith->SetBuildTime(40.0);
    blacksmith->AddCost(Resource("Wood", 150));
    blacksmith->SetDescription("Provides military upgrades");
    game->AddItem(blacksmith);
    
    auto market = std::make_shared<GameItem>("market", "Market", "Building");
    market->SetBuildTime(60.0);
    market->AddCost(Resource("Wood", 175));
    market->SetDescription("Allows trade and resource exchange");
    game->AddItem(market);
    
    // Feudal Age units
    auto archer = std::make_shared<GameItem>("archer", "Archer", "Unit");
    archer->SetBuildTime(35.0);
    archer->AddCost(Resource("Wood", 25));
    archer->AddCost(Resource("Gold", 45));
    archer->SetDescription("Ranged unit, requires Feudal Age");
    game->AddItem(archer);
    
    auto spearman = std::make_shared<GameItem>("spearman", "Spearman", "Unit");
    spearman->SetBuildTime(22.0);
    spearman->AddCost(Resource("Food", 35));
    spearman->AddCost(Resource("Wood", 25));
    spearman->SetDescription("Anti-cavalry infantry, requires Feudal Age");
    game->AddItem(spearman);
    
    // Age Advances
    auto feudalAge = std::make_shared<GameItem>("feudal_age", "Advance to Feudal Age", "Age");
    feudalAge->SetBuildTime(130.0);
    feudalAge->AddCost(Resource("Food", 500));
    feudalAge->SetDescription("Advance to Feudal Age (requires 2 Dark Age buildings)");
    game->AddItem(feudalAge);
    
    auto castleAge = std::make_shared<GameItem>("castle_age", "Advance to Castle Age", "Age");
    castleAge->SetBuildTime(160.0);
    castleAge->AddCost(Resource("Food", 800));
    castleAge->AddCost(Resource("Gold", 200));
    castleAge->SetDescription("Advance to Castle Age (requires 2 Feudal Age buildings)");
    game->AddItem(castleAge);
    
    return game;
}
```

### Step 3: Declare the Method in Header

Open `lib/include/GameFactory.h` and add the declaration:

```cpp
namespace gameplanner {

class GameFactory {
public:
    static std::shared_ptr<Game> CreateStarCraft2Game();
    static std::shared_ptr<Game> CreateHeartsOfIronGame();
    static std::shared_ptr<Game> CreateAgeOfEmpiresGame();  // Add this line
    static std::vector<std::shared_ptr<Game>> CreateAllGames();
};

} // namespace gameplanner
```

### Step 4: Add to CreateAllGames

In `GameFactory.cpp`, update the `CreateAllGames()` method:

```cpp
std::vector<std::shared_ptr<Game>> GameFactory::CreateAllGames() {
    std::vector<std::shared_ptr<Game>> games;
    games.push_back(CreateStarCraft2Game());
    games.push_back(CreateHeartsOfIronGame());
    games.push_back(CreateAgeOfEmpiresGame());  // Add this line
    return games;
}
```

### Step 5: Build and Test

```bash
cd build
cmake ..
cmake --build .
./examples/GamePlannerDemo
```

You should now see Age of Empires II in the output!

## Adding Items to Existing Games

To add more items to an existing game, simply add more items in the factory method:

```cpp
std::shared_ptr<Game> GameFactory::CreateStarCraft2Game() {
    auto game = std::make_shared<Game>("sc2", "StarCraft 2");
    // ... existing items ...
    
    // Add new item
    auto siegeTank = std::make_shared<GameItem>("siege_tank", "Siege Tank", "Vehicle");
    siegeTank->SetBuildTime(32.0);
    siegeTank->AddCost(Resource("Minerals", 150));
    siegeTank->AddCost(Resource("Gas", 125));
    siegeTank->SetDescription("Heavy assault vehicle with siege mode");
    game->AddItem(siegeTank);
    
    return game;
}
```

## Understanding the Data Structure

### GameItem Properties

Each `GameItem` has:
- **ID**: Unique identifier (e.g., "villager")
- **Name**: Display name (e.g., "Villager")
- **Category**: Type classification (e.g., "Unit", "Building", "Age")
- **Build Time**: Time in seconds to complete
- **Costs**: Vector of resources with amounts
- **Description**: Helpful text for users

### Resource Types

Resources are flexible. Use whatever makes sense for your game:
- StarCraft 2: "Minerals", "Gas", "Supply"
- Age of Empires: "Food", "Wood", "Gold", "Stone"
- Hearts of Iron: "Industrial Capacity", "Infantry Equipment"

### Categories

Categories help organize items:
- **Units**: Military and worker units
- **Buildings/Structures**: Constructible buildings
- **Research/Technology**: Upgrades and advancements
- **Age**: Age advances (AoE specific)
- **Division**: Military divisions (HoI specific)

## Best Practices

1. **Use Consistent IDs**: Use lowercase with underscores (e.g., "siege_tank")
2. **Accurate Build Times**: Research actual game values for realism
3. **Complete Costs**: Include all resource requirements
4. **Clear Descriptions**: Help users understand each item
5. **Logical Categories**: Group similar items together
6. **Start Simple**: Begin with core items, add more later

## Example Build Orders

After adding Age of Empires II, you can create build orders like:

```
1. Villager (50 Food)
2. Villager (50 Food)
3. House (25 Wood)
4. Villager (50 Food)
5. Villager (50 Food)
6. Lumber Camp (100 Wood)
7. Villager (50 Food) - to wood
8. Mill (100 Wood)
9. Villager (50 Food) - to berries
... continue to Feudal Age
```

## Testing Your New Game

1. **Run the demo**: `./build/examples/GamePlannerDemo`
2. **Verify all items appear**: Check the output lists all items
3. **Check data accuracy**: Ensure costs and times are correct
4. **Test in UI**: If you have the WinUI app, verify the game appears
5. **Create sample build order**: Test that items can be added to orders

## Common Issues

### Game Doesn't Appear
- Did you add it to `CreateAllGames()`?
- Did you declare it in the header file?
- Did you rebuild the project?

### Items Display Incorrectly
- Check that ID, name, and category are set
- Verify costs are added correctly
- Ensure description is helpful

### Build Fails
- Make sure you're using C++23 features correctly
- Check for typos in function names
- Verify all includes are present

## Next Steps

After adding a game:
1. Add more items to make it comprehensive
2. Create example build orders in the demo
3. Share your game data with the community
4. Consider adding game-specific features (prerequisites, etc.)

## Contributing Your Game

If you'd like to contribute your game to the main repository:
1. Ensure data is accurate (verified against game)
2. Add comprehensive item coverage
3. Include meaningful descriptions
4. Create example build orders
5. Submit a pull request with your changes

Happy planning!
