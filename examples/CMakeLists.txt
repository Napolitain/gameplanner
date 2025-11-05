add_executable(GamePlannerDemo
    demo.cpp
)

target_link_libraries(GamePlannerDemo PRIVATE
    GamePlannerLib
)

target_compile_features(GamePlannerDemo PRIVATE cxx_std_23)
