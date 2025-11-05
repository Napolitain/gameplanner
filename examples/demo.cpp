#include "GamePlanner.h"
#include "GameFactory.h"
#include <format>
#include <iostream>

using namespace gameplanner;

void printGame(const std::shared_ptr<Game>& game) {
    std::cout << std::format("\n=== {} ===\n", game->GetName());
    std::cout << std::format("{}\n", game->GetDescription());
    std::cout << std::format("\nAvailable Items ({} total):\n", game->GetItems().size());
    
    for (const auto& item : game->GetItems()) {
        if (!item->GetCategory().empty()) {
            std::cout << std::format("\n  {} [{}]\n", item->GetName(), item->GetCategory());
        } else {
            std::cout << std::format("\n  {}\n", item->GetName());
        }
        
        if (!item->GetDescription().empty()) {
            std::cout << std::format("    {}\n", item->GetDescription());
        }
        
        if (item->GetBuildTime() > 0) {
            std::cout << std::format("    Build Time: {}s\n", item->GetBuildTime());
        }
        
        if (!item->GetCosts().empty()) {
            std::cout << "    Cost: ";
            for (size_t i = 0; i < item->GetCosts().size(); ++i) {
                if (i > 0) std::cout << ", ";
                const auto& cost = item->GetCosts()[i];
                std::cout << std::format("{} {}", cost.amount, cost.name);
            }
            std::cout << '\n';
        }
    }
}

void demonstrateBuildOrder(const std::shared_ptr<Game>& game) {
    std::cout << std::format("\n\n=== Sample Build Order for {} ===\n", game->GetName());
    
    BuildOrder buildOrder("Opening Build");
    
    // Create a sample build order for StarCraft 2
    if (game->GetId() == "sc2") {
        auto scv = game->FindItem("scv");
        auto supplyDepot = game->FindItem("supply_depot");
        auto barracks = game->FindItem("barracks");
        auto marine = game->FindItem("marine");
        
        if (scv) {
            buildOrder.AddStep(scv);
            buildOrder.AddStep(scv);
        }
        if (supplyDepot) {
            buildOrder.AddStep(supplyDepot);
        }
        if (scv) {
            buildOrder.AddStep(scv);
        }
        if (barracks) {
            buildOrder.AddStep(barracks);
        }
        if (marine) {
            buildOrder.AddStep(marine);
            buildOrder.AddStep(marine);
        }
    }
    // Create a sample build order for Hearts of Iron IV
    else if (game->GetId() == "hoi4") {
        auto civFactory = game->FindItem("civ_factory");
        auto milFactory = game->FindItem("mil_factory");
        auto infantry = game->FindItem("infantry_div");
        
        if (civFactory) {
            buildOrder.AddStep(civFactory);
        }
        if (milFactory) {
            buildOrder.AddStep(milFactory);
        }
        if (infantry) {
            buildOrder.AddStep(infantry);
            buildOrder.AddStep(infantry);
        }
    }
    
    std::cout << std::format("\nBuild Order: {}\n", buildOrder.GetName());
    std::cout << std::format("Total Steps: {}\n", buildOrder.GetSteps().size());
    std::cout << "\nSteps:\n";
    
    for (const auto& step : buildOrder.GetSteps()) {
        const auto& item = step->GetItem();
        std::cout << std::format("  {:2}. {}", step->GetStepNumber(), item->GetName());
        
        if (!item->GetCosts().empty()) {
            std::cout << " (";
            for (size_t i = 0; i < item->GetCosts().size(); ++i) {
                if (i > 0) std::cout << ", ";
                const auto& cost = item->GetCosts()[i];
                std::cout << std::format("{} {}", cost.amount, cost.name);
            }
            std::cout << ")";
        }
        std::cout << '\n';
    }
}

int main() {
    std::cout << "==================================================\n";
    std::cout << "    Game Planner - Build Order System Demo\n";
    std::cout << "==================================================\n";
    
    // Load all games
    auto games = GameFactory::CreateAllGames();
    
    std::cout << std::format("\nLoaded {} games:\n", games.size());
    for (const auto& game : games) {
        std::cout << std::format("  - {}\n", game->GetName());
    }
    
    // Print details for each game
    for (const auto& game : games) {
        printGame(game);
    }
    
    // Demonstrate build orders
    for (const auto& game : games) {
        demonstrateBuildOrder(game);
    }
    
    std::cout << "\n\n==================================================\n";
    std::cout << "Demo completed successfully!\n";
    std::cout << "==================================================\n";
    
    return 0;
}
