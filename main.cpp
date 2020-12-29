#include <QCoreApplication>
#include <units/physical/si/derived/capacitance.h>
#include <units/physical/si/derived/resistance.h>
#include <units/physical/si/base/time.h>
#include <units/physical/si/derived/voltage.h>
#include <units/math.h>
#include <units/quantity_io.h>
#include <iostream>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    return a.exec();
}
