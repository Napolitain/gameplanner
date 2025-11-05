#pragma once

#include <string>
#include <vector>
#include <memory>
#include <optional>

namespace gameplanner {

// Represents a resource type (e.g., minerals, gas, supply)
struct Resource {
    std::string name;
    double amount;
    
    Resource(const std::string& name = "", double amount = 0.0)
        : name(name), amount(amount) {}
};

// Represents a single item/action/unit that can be built or performed
class GameItem {
public:
    GameItem(const std::string& id, const std::string& name, const std::string& category = "")
        : id_(id), name_(name), category_(category) {}
    
    const std::string& GetId() const { return id_; }
    const std::string& GetName() const { return name_; }
    const std::string& GetCategory() const { return category_; }
    
    void SetBuildTime(double seconds) { build_time_ = seconds; }
    double GetBuildTime() const { return build_time_; }
    
    void AddCost(const Resource& resource) { costs_.push_back(resource); }
    const std::vector<Resource>& GetCosts() const { return costs_; }
    
    void SetDescription(const std::string& desc) { description_ = desc; }
    const std::string& GetDescription() const { return description_; }
    
private:
    std::string id_;
    std::string name_;
    std::string category_;
    double build_time_ = 0.0;
    std::vector<Resource> costs_;
    std::string description_;
};

// Represents a game with its items and rules
class Game {
public:
    Game(const std::string& id, const std::string& name)
        : id_(id), name_(name) {}
    
    const std::string& GetId() const { return id_; }
    const std::string& GetName() const { return name_; }
    
    void AddItem(std::shared_ptr<GameItem> item) { items_.push_back(item); }
    const std::vector<std::shared_ptr<GameItem>>& GetItems() const { return items_; }
    
    std::shared_ptr<GameItem> FindItem(const std::string& id) const {
        for (const auto& item : items_) {
            if (item->GetId() == id) {
                return item;
            }
        }
        return nullptr;
    }
    
    void SetDescription(const std::string& desc) { description_ = desc; }
    const std::string& GetDescription() const { return description_; }
    
private:
    std::string id_;
    std::string name_;
    std::string description_;
    std::vector<std::shared_ptr<GameItem>> items_;
};

// Represents a single step in a build order
class BuildOrderStep {
public:
    BuildOrderStep(std::shared_ptr<GameItem> item, int step_number = 0)
        : item_(item), step_number_(step_number) {}
    
    std::shared_ptr<GameItem> GetItem() const { return item_; }
    int GetStepNumber() const { return step_number_; }
    void SetStepNumber(int num) { step_number_ = num; }
    
    void SetNotes(const std::string& notes) { notes_ = notes; }
    const std::string& GetNotes() const { return notes_; }
    
private:
    std::shared_ptr<GameItem> item_;
    int step_number_;
    std::string notes_;
};

// Represents a complete build order
class BuildOrder {
public:
    BuildOrder(const std::string& name = "New Build Order")
        : name_(name) {}
    
    const std::string& GetName() const { return name_; }
    void SetName(const std::string& name) { name_ = name; }
    
    void AddStep(std::shared_ptr<GameItem> item) {
        auto step = std::make_shared<BuildOrderStep>(item, steps_.size() + 1);
        steps_.push_back(step);
    }
    
    void RemoveStep(size_t index) {
        if (index < steps_.size()) {
            steps_.erase(steps_.begin() + index);
            RenumberSteps();
        }
    }
    
    void MoveStep(size_t from, size_t to) {
        if (from < steps_.size() && to < steps_.size() && from != to) {
            auto step = steps_[from];
            steps_.erase(steps_.begin() + from);
            steps_.insert(steps_.begin() + to, step);
            RenumberSteps();
        }
    }
    
    const std::vector<std::shared_ptr<BuildOrderStep>>& GetSteps() const { return steps_; }
    
    void Clear() { steps_.clear(); }
    
private:
    void RenumberSteps() {
        for (size_t i = 0; i < steps_.size(); ++i) {
            steps_[i]->SetStepNumber(i + 1);
        }
    }
    
    std::string name_;
    std::vector<std::shared_ptr<BuildOrderStep>> steps_;
};

} // namespace gameplanner
