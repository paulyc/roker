#include <units/format.h>
#include <units/physical/si/derived/speed.h>
#include <units/physical/si/international/derived/speed.h>
#include <units/quantity_io.h>
#include <iostream>

using namespace units::physical;

constexpr Speed auto avg_speed(Length auto d, Time auto t)
{
  return d / t;
}

int main()
{
  using namespace units::physical::si::literals;
  using namespace units::physical::si::unit_constants;

  constexpr Speed auto v1 = 110 * km / h;
  constexpr Speed auto v2 = avg_speed(220_q_km, 2_q_h);
  constexpr Speed auto v3 = avg_speed(si::length<si::international::mile>(140), si::time<si::hour>(2));
  constexpr Speed auto v4 = quantity_cast<si::speed<si::metre_per_second>>(v2);
  constexpr Speed auto v5 = quantity_cast<si::metre_per_second>(v3);
  constexpr Speed auto v6 = quantity_cast<int>(v5);

  std::cout << v1 << '\n';                                  // 110 km/h
  std::cout << fmt::format("{}", v2) << '\n';               // 110 km/h
  std::cout << fmt::format("{:*^14}", v3) << '\n';          // ***70 mi/h****
  std::cout << fmt::format("{:%Q in %q}", v4) << '\n';      // 30.5556 in m/s
  std::cout << fmt::format("{0:%Q} in {0:%q}", v5) << '\n'; // 31.2928 in m/s
  std::cout << fmt::format("{:%Q}", v6) << '\n';            // 31
}
