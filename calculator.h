#ifndef CALCULATOR_H
#define CALCULATOR_H

#include <QObject>
#include <array>

class Calculator : public QObject
{
    Q_OBJECT
public:
    Calculator();

    enum Quantity {
        Temperature,
        Dewpoint,
        RelativeHumidity,
        Pressure,
        PartialPressure
    };

public slots:
    void calculate(Quantity type, int index);
};

#endif // CALCULATOR_H
