#include "GamePlanner.h"
#include "GameFactory.h"
#include <print>

using namespace gameplanner;

void printGame(const std::shared_ptr<Game>& game) {
    std::println("\n=== {} ===", game->GetName());
    std::println("{}", game->GetDescription());
    std::println("\nAvailable Items ({} total):", game->GetItems().size());
    
    for (const auto& item : game->GetItems()) {
        if (!item->GetCategory().empty()) {
            std::println("\n  {} [{}]", item->GetName(), item->GetCategory());
        } else {
            std::println("\n  {}", item->GetName());
        }
        
        if (!item->GetDescription().empty()) {
            std::println("    {}", item->GetDescription());
        }
        
        if (item->GetBuildTime() > 0) {
            std::println("    Build Time: {}s", item->GetBuildTime());
        }
        
        if (!item->GetCosts().empty()) {
            std::print("    Cost: ");
            for (size_t i = 0; i < item->GetCosts().size(); ++i) {
                if (i > 0) std::print(", ");
                const auto& cost = item->GetCosts()[i];
                std::print("{} {}", cost.amount, cost.name);
            }
            std::println("");
        }
    }
}

void demonstrateBuildOrder(const std::shared_ptr<Game>& game) {
    std::println("\n\n=== Sample Build Order for {} ===", game->GetName());
    
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
    
    std::println("\nBuild Order: {}", buildOrder.GetName());
    std::println("Total Steps: {}", buildOrder.GetSteps().size());
    std::println("\nSteps:");
    
    for (const auto& step : buildOrder.GetSteps()) {
        const auto& item = step->GetItem();
        std::print("  {:2}. {}", step->GetStepNumber(), item->GetName());
        
        if (!item->GetCosts().empty()) {
            std::print(" (");
            for (size_t i = 0; i < item->GetCosts().size(); ++i) {
                if (i > 0) std::print(", ");
                const auto& cost = item->GetCosts()[i];
                std::print("{} {}", cost.amount, cost.name);
            }
            std::print(")");
        }
        std::println("");
    }
}

int main() {
    std::println("==================================================");
    std::println("    Game Planner - Build Order System Demo");
    std::println("==================================================");
    
    // Load all games
    auto games = GameFactory::CreateAllGames();
    
    std::println("\nLoaded {} games:", games.size());
    for (const auto& game : games) {
        std::println("  - {}", game->GetName());
    }
    
    // Print details for each game
    for (const auto& game : games) {
        printGame(game);
    }
    
    // Demonstrate build orders
    for (const auto& game : games) {
        demonstrateBuildOrder(game);
    }
    
    std::println("\n\n==================================================");
    std::println("Demo completed successfully!");
    std::println("==================================================");
    
    return 0;
}
