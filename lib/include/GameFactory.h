#pragma once

#include "GamePlanner.h"
#include <vector>
#include <memory>

namespace gameplanner {

// Factory class to create sample game data
class GameFactory {
public:
    static std::shared_ptr<Game> CreateStarCraft2Game();
    static std::shared_ptr<Game> CreateHeartsOfIronGame();
    static std::vector<std::shared_ptr<Game>> CreateAllGames();
};

} // namespace gameplanner
