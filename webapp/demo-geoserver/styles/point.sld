<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Substation_Locations</Name>
        <UserStyle>
            <Name>point</Name>
            <Title>Red Square Point</Title>
            <IsDefault>1</IsDefault>
            <Abstract>A sample style that draws a red square point</Abstract>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>rule1</Name>
                    <Title>Red Square Point</Title>
                    <Abstract>A 6 pixel square with a red fill and no stroke</Abstract>
                    <PointSymbolizer>
                        <Graphic>
                            <Mark>
                                <Fill>
                                    <CssParameter name="fill">#FF0000</CssParameter>
                                <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                            </Mark>
                            <Size>6</Size>
                        </Graphic>
                    </PointSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>