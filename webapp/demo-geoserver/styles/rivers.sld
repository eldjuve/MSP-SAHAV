<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:River</Name>
        <UserStyle>
            <Name>rivers</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name />
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#23e798</CssParameter>
                            <CssParameter name="stroke-linecap">square</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                            <CssParameter name="stroke-width">2</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </LineSymbolizer>
                </Rule>
                <Rule>
                    <TextSymbolizer>
                        <Label>
                            <ogc:PropertyName>River_Name</ogc:PropertyName>
                        </Label>
                        <Font>
                            <CssParameter name="font-family">Open Sans</CssParameter>
                            <CssParameter name="font-size">13</CssParameter>
                            <CssParameter name="font-style">normal</CssParameter>
                            <CssParameter name="font-weight">normal</CssParameter>
                        </Font>
                        <LabelPlacement>
                            <LinePlacement />
                        </LabelPlacement>
                        <Fill>
                            <CssParameter name="fill">#323232</CssParameter>
                        </Fill>
                    </TextSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>